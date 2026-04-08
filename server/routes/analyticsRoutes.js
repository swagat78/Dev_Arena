import express from 'express';

import {
  getGlobalLeaderboard,
  getMyCodingStats,
  getUserLoginInsights,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/me-stats', getMyCodingStats);
router.get('/leaderboard', getGlobalLeaderboard);
router.get('/users', getUserLoginInsights);

export default router;
