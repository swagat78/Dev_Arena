import express from 'express';
import path from 'path';
import multer from 'multer';
import { User } from '../models/User.js';
import { Submission } from '../models/Submission.js';
import { Achievement } from '../models/Achievement.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Setup multer for local storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, png, jpeg, webp)!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const router = express.Router();

router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // --- DYNAMIC STATS CALCULATION ---
  // 1. Problems Solved (Unique accepted problems)
  const uniqueAccepted = await Submission.distinct('problem', { user: user._id, status: 'accepted' });
  const dynamicProblemsSolved = uniqueAccepted.length;

  // 2. Acceptance Rate
  const totalSubmissionsCount = await Submission.countDocuments({ user: user._id });
  const acceptedSubmissionsCount = await Submission.countDocuments({ user: user._id, status: 'accepted' });
  let dynamicAcceptanceRate = 0;
  if (totalSubmissionsCount > 0) {
    dynamicAcceptanceRate = Math.round((acceptedSubmissionsCount / totalSubmissionsCount) * 100);
  }

  // 3. Rank (Comparison with other users based on problems solved)
  const usersAhead = await User.countDocuments({ problemsSolved: { $gt: dynamicProblemsSolved } });
  // If multiple users have the same score, they share the same rank
  const dynamicRank = usersAhead + 1;

  // Save dynamic stats to DB to maintain global accuracy for others' rank calculations
  if (user.problemsSolved !== dynamicProblemsSolved || user.acceptanceRate !== dynamicAcceptanceRate || user.rank !== dynamicRank) {
    user.problemsSolved = dynamicProblemsSolved;
    user.acceptanceRate = dynamicAcceptanceRate;
    user.rank = dynamicRank;
    await user.save();
  }
  // ---------------------------------

  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  const submissions = await Submission.aggregate([
    {
      $match: {
        user: user._id,
        createdAt: { $gte: oneYearAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    }
  ]);

  const activityHeatmap = submissions.map(s => ({
    date: s._id,
    count: s.count
  }));

  const achievements = await Achievement.find({ user: user._id })
    .select('type title description earnedAt -_id')
    .sort({ earnedAt: -1 });

  res.json({
    name: user.name,
    username: user.username || user.name.toLowerCase().replace(/\s+/g, ''),
    email: user.email,
    bio: user.profile?.readme || 'No bio provided.',
    avatar: user.profile?.avatarUrl || '',
    github: user.profile?.github || '',
    linkedin: user.profile?.linkedin || '',
    problemsSolved: dynamicProblemsSolved,
    rank: dynamicRank,
    acceptanceRate: dynamicAcceptanceRate,
    activityHeatmap,
    achievements
  });
}));

router.patch('/avatar', protect, upload.single('image'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No image provided or invalid file type');
  }

  // Construct URL
  const serverUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com' // You'd set a SERVER_URL env in prod
    : 'http://localhost:5001';
    
  const avatarUrl = `${serverUrl}/uploads/${req.file.filename}`;

  // Initialize profile if it doesn't exist
  if (!user.profile) {
    user.profile = {};
  }

  user.profile.avatarUrl = avatarUrl;
  await user.save();

  res.json({
    success: true,
    avatar: avatarUrl
  });
}));

export default router;
