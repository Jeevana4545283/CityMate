import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import {
  getProfile,
  createOrUpdateProfile,
  discoverPartners,
  expressInterest,
  getMatches,
  reportOrBlock
} from '../controllers/roommateController';

const router = express.Router();

router.use(authenticateJWT); // All roommate routes require authentication

router.get('/profile', getProfile);
router.post('/profile', createOrUpdateProfile);
router.get('/discover', discoverPartners);
router.post('/interest', expressInterest);
router.get('/matches', getMatches);
router.post('/report-block', reportOrBlock);

export default router;
