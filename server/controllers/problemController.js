import mongoose from 'mongoose';

import { Problem } from '../models/Problem.js';
import { Submission } from '../models/Submission.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const buildStarterTemplates = (problem) => {
  const firstExample = (problem.examples || [])[0] || {};
  const exampleInput = firstExample.input ?? '...';
  const exampleOutput = firstExample.output ?? '...';

  return {
    javascript: `function solve(input) {\n  // TODO: write your solution\n  // Example input: ${exampleInput}\n  // Example output: ${exampleOutput}\n\n  return input;\n}`,
    python: `def solve(input):\n    # TODO: write your solution\n    # Example input: ${exampleInput}\n    # Example output: ${exampleOutput}\n\n    return input`,
    java:
      `class Solution {\n  public Object solve(Object input) {\n    // TODO: write your solution\n    // Example input: ${exampleInput}\n    // Example output: ${exampleOutput}\n\n    return input;\n  }\n}`,
    cpp:
      `#include <bits/stdc++.h>\nusing namespace std;\n\n// TODO: write your solution\n// Example input: ${exampleInput}\n// Example output: ${exampleOutput}\n\n/*\nImplement your logic and print/return the required output format.\n*/\n`,
  };
};

const sanitizeProblemForWorkspace = (problem) => {
  const safe = problem.toObject();
  safe.testCases = (safe.testCases || []).filter((testCase) => !testCase.isHidden);
  safe.starterCode = buildStarterTemplates(safe);
  return safe;
};

export const getProblems = asyncHandler(async (req, res) => {
  const { difficulty, tag, search } = req.query;

  const query = {};
  if (difficulty) query.difficulty = difficulty;
  if (tag) query.tags = tag;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const problems = await Problem.find(query)
    .select('title slug difficulty tags totalSubmissions acceptedSubmissions createdAt')
    .sort({ difficulty: 1, createdAt: -1 });

  res.json(problems);
});

export const getProblemBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const problem = await Problem.findOne({ slug });

  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }

  const userBest = await Submission.findOne({
    user: req.user._id,
    problem: problem._id,
    status: 'accepted',
  })
    .sort({ createdAt: -1 })
    .select('status runtimeMs memoryKb language createdAt');

  res.json({
    ...sanitizeProblemForWorkspace(problem),
    userSolved: Boolean(userBest),
    userBestSubmission: userBest,
  });
});

export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid problem id');
  }

  const problem = await Problem.findById(id);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }

  res.json(sanitizeProblemForWorkspace(problem));
});
