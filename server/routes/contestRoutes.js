import express from 'express';

import { getContestBySlug, getContests } from '../controllers/contestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getContests);
router.get('/:slug', getContestBySlug);

export default router;
