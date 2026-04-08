import express from 'express';

import {
  createSubmission,
  getMySubmissions,
  getSubmissionById,
} from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getMySubmissions).post(createSubmission);
router.get('/:id', getSubmissionById);

export default router;
