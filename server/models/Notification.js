import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['submission_success', 'submission_failed', 'achievement_unlocked', 'contest_added', 'profile_incomplete'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: -1,
  }
});

notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
