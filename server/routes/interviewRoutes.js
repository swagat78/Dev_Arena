import express from 'express';

import {
  createInterview,
  getInterviewByRoomId,
  getMyInterviews,
  updateInterviewCode,
  updateInterviewStatus,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getMyInterviews).post(createInterview);
router.get('/room/:roomId', getInterviewByRoomId);
router.patch('/:id/status', updateInterviewStatus);
router.patch('/:id/code', updateInterviewCode);

export default router;
