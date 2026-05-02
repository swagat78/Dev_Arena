import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  let notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10);

  if (notifications.length === 0) {
    const welcomeNotif = await Notification.create({
      user: req.user._id,
      type: 'system',
      title: 'Welcome to Dev Arena 🚀',
      message: 'You joined Dev Arena. Start solving problems to grow.',
      isRead: false
    });
    notifications = [welcomeNotif];
  }

  res.json(notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json(notification);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({ message: 'All notifications marked as read' });
});
