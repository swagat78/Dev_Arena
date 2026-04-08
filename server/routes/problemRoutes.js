import express from 'express';

import { getProblemById, getProblemBySlug, getProblems } from '../controllers/problemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProblems);
router.get('/slug/:slug', getProblemBySlug);
router.get('/:id', getProblemById);

export default router;
