import mongoose from 'mongoose';

import { Problem } from '../models/Problem.js';
import { Submission } from '../models/Submission.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { evaluateSubmission } from '../utils/codeExecutor.js';
import { checkAndAwardAchievements } from '../utils/achievementEngine.js';

const getVerdictLabel = (status) => {
  const labels = {
    accepted: 'Accepted',
    wrong_answer: 'Wrong Answer',
    runtime_error: 'Runtime Error',
    time_limit_exceeded: 'Time Limit Exceeded',
  };

  return labels[status] || 'Unknown Verdict';
};

const withVerdictLabel = (submission) => {
  const plain = submission.toObject ? submission.toObject() : submission;
  return {
    ...plain,
    verdictLabel: getVerdictLabel(plain.status),
  };
};

export const createSubmission = asyncHandler(async (req, res) => {
  const { problemId, language, sourceCode } = req.body;

  if (!problemId || !mongoose.Types.ObjectId.isValid(problemId)) {
    res.status(400);
    throw new Error('A valid problemId is required');
  }

  if (!sourceCode?.trim()) {
    res.status(400);
    throw new Error('Source code is required');
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }

  const verdict = await evaluateSubmission(sourceCode, language, problem.testCases);

  const submission = await Submission.create({
    user: req.user._id,
    problem: problem._id,
    language,
    sourceCode,
    ...verdict,
  });

  problem.totalSubmissions += 1;
  const user = await User.findById(req.user._id);
  user.totalSubmissions += 1;

  if (verdict.status === 'accepted') {
    problem.acceptedSubmissions += 1;
    user.acceptedSubmissions += 1;
    
    // Check if problem was already solved
    const existingAccepted = await Submission.findOne({
      user: req.user._id,
      problem: problem._id,
      status: 'accepted',
      _id: { $ne: submission._id }
    });

    if (!existingAccepted) {
      user.problemsSolved += 1;
    }

    await Notification.create({
      user: req.user._id,
      type: 'submission_success',
      title: 'Problem Solved 🎉',
      message: `You solved ${problem.title}`,
      link: `/problems/${problem.slug}`,
    });
  } else {
    await Notification.create({
      user: req.user._id,
      type: 'submission_failed',
      title: 'Submission Failed ❌',
      message: `Your solution for ${problem.title} received ${getVerdictLabel(verdict.status)}`,
      link: `/problems/${problem.slug}`,
    });
  }
  
  user.acceptanceRate = Math.round((user.acceptedSubmissions / user.totalSubmissions) * 100);
  
  await problem.save();
  await user.save();

  // Asynchronously check and award achievements in the background
  checkAndAwardAchievements(req.user._id);

  const populated = await Submission.findById(submission._id)
    .populate('problem', 'title slug difficulty')
    .populate('user', 'name email');

  res.status(201).json(withVerdictLabel(populated));
});

export const getMySubmissions = asyncHandler(async (req, res) => {
  const { problemId } = req.query;

  const query = { user: req.user._id };
  if (problemId && mongoose.Types.ObjectId.isValid(problemId)) {
    query.problem = problemId;
  }

  const submissions = await Submission.find(query)
    .populate('problem', 'title slug difficulty')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(submissions.map((submission) => withVerdictLabel(submission)));
});

export const getRecentSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ user: req.user._id })
    .populate('problem', 'title slug difficulty')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json(submissions.map((submission) => withVerdictLabel(submission)));
});

export const getSubmissionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid submission id');
  }

  const submission = await Submission.findById(id)
    .populate('problem', 'title slug difficulty')
    .populate('user', 'name email');

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  if (submission.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  res.json(withVerdictLabel(submission));
});
