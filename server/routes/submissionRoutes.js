import express from 'express';

import {
  createSubmission,
  getMySubmissions,
  getSubmissionById,
  getRecentSubmissions,
} from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getMySubmissions).post(createSubmission);
router.get('/recent', getRecentSubmissions);
router.get('/:id', getSubmissionById);

export default router;
