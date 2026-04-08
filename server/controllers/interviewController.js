import mongoose from 'mongoose';

import { Interview } from '../models/Interview.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isParticipant = (interview, userId) =>
  interview.interviewer.toString() === userId.toString() ||
  interview.candidate.toString() === userId.toString();

export const createInterview = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    candidateEmail,
    scheduledAt,
    durationMinutes,
    problemStatement,
    language,
    starterCode,
  } = req.body;

  if (!title?.trim() || !candidateEmail?.trim() || !scheduledAt) {
    res.status(400);
    throw new Error('Title, candidate email, and scheduled time are required');
  }

  const candidate = await User.findOne({ email: candidateEmail.toLowerCase().trim() });
  if (!candidate) {
    res.status(404);
    throw new Error('Candidate account not found for the provided email');
  }

  if (candidate._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Interviewer and candidate cannot be the same user');
  }

  const roomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const interview = await Interview.create({
    title: title.trim(),
    description: description?.trim() || '',
    interviewer: req.user._id,
    candidate: candidate._id,
    scheduledAt,
    durationMinutes,
    roomId,
    problemStatement: problemStatement?.trim(),
    language,
    starterCode: starterCode?.trim(),
    latestCode: starterCode?.trim() || '',
  });

  const populated = await Interview.findById(interview._id)
    .populate('interviewer', 'name email')
    .populate('candidate', 'name email');

  res.status(201).json(populated);
});

export const getMyInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    $or: [{ interviewer: req.user._id }, { candidate: req.user._id }],
  })
    .populate('interviewer', 'name email')
    .populate('candidate', 'name email')
    .sort({ scheduledAt: 1 });

  res.json(interviews);
});

export const getInterviewByRoomId = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const interview = await Interview.findOne({ roomId })
    .populate('interviewer', 'name email')
    .populate('candidate', 'name email');

  if (!interview) {
    res.status(404);
    throw new Error('Interview room not found');
  }

  if (!isParticipant(interview, req.user._id)) {
    res.status(403);
    throw new Error('Access denied to this interview room');
  }

  res.json(interview);
});

export const updateInterviewStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid interview id');
  }

  const interview = await Interview.findById(id);
  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  if (!isParticipant(interview, req.user._id)) {
    res.status(403);
    throw new Error('Access denied');
  }

  interview.status = status || interview.status;
  await interview.save();

  const updated = await Interview.findById(id)
    .populate('interviewer', 'name email')
    .populate('candidate', 'name email');

  res.json(updated);
});

export const updateInterviewCode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { latestCode, language } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid interview id');
  }

  const interview = await Interview.findById(id);
  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  if (!isParticipant(interview, req.user._id)) {
    res.status(403);
    throw new Error('Access denied');
  }

  interview.latestCode = latestCode ?? interview.latestCode;
  interview.language = language ?? interview.language;
  await interview.save();

  res.json({ message: 'Code saved', latestCode: interview.latestCode, language: interview.language });
});
