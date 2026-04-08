import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp'],
      default: 'javascript',
    },
    sourceCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded'],
      default: 'wrong_answer',
      index: true,
    },
    runtimeMs: {
      type: Number,
      default: 0,
    },
    memoryKb: {
      type: Number,
      default: 0,
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

export const Submission = mongoose.model('Submission', submissionSchema);
