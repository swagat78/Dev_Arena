import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['first_problem', '50_problems', '100_problems', '7_day_streak'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  }
});

// Ensure a user can only earn a specific achievement once
achievementSchema.index({ user: 1, type: 1 }, { unique: true });

export const Achievement = mongoose.model('Achievement', achievementSchema);
