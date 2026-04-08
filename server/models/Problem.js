import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: true },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    examples: {
      type: [exampleSchema],
      default: [],
    },
    constraints: {
      type: [String],
      default: [],
    },
    starterCode: {
      javascript: {
        type: String,
        default: 'function solve(input) {\n  // write your code here\n  return input;\n}',
      },
      python: {
        type: String,
        default: 'def solve(input):\n    # write your code here\n    return input',
      },
      java: {
        type: String,
        default:
          'class Solution {\n  public Object solve(Object input) {\n    // write your code here\n    return input;\n  }\n}',
      },
      cpp: {
        type: String,
        default:
          '#include <bits/stdc++.h>\nusing namespace std;\n\n// write your code in solve()\n',
      },
    },
    testCases: {
      type: [testCaseSchema],
      default: [],
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    acceptedSubmissions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

problemSchema.virtual('acceptanceRate').get(function acceptanceRate() {
  if (!this.totalSubmissions) return 0;
  return Math.round((this.acceptedSubmissions / this.totalSubmissions) * 100);
});

problemSchema.set('toJSON', { virtuals: true });
problemSchema.set('toObject', { virtuals: true });

export const Problem = mongoose.model('Problem', problemSchema);
