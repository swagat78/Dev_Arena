import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Interview title is required'],
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 3000,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled time is required'],
    },
    durationMinutes: {
      type: Number,
      default: 60,
      min: 15,
      max: 240,
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    problemStatement: {
      type: String,
      default: 'Implement the function and explain your approach clearly.',
      trim: true,
    },
    language: {
      type: String,
      enum: ['javascript', 'typescript', 'python', 'java', 'cpp'],
      default: 'javascript',
    },
    starterCode: {
      type: String,
      default: 'function solve(input) {\n  // write code here\n  return input;\n}',
    },
    latestCode: {
      type: String,
      default: '',
    },
    notes: {
      interviewerNotes: { type: String, default: '' },
      candidateNotes: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const Interview = mongoose.model('Interview', interviewSchema);
