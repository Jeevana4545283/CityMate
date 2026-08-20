import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import {
  sendSportsRequest,
  getMySentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  getMyPosts,
  deletePost
} from '../controllers/sportsRequestController';

const router = Router();

router.post('/', authenticateJWT, sendSportsRequest);
router.get('/my-requests', authenticateJWT, getMySentRequests);
router.get('/received', authenticateJWT, getReceivedRequests);
router.put('/:id/accept', authenticateJWT, acceptRequest);
router.put('/:id/reject', authenticateJWT, rejectRequest);
router.delete('/:id/cancel', authenticateJWT, cancelRequest);
router.get('/my-posts', authenticateJWT, getMyPosts);
router.delete('/posts/:id', authenticateJWT, deletePost);

export default router;
