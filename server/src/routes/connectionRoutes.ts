import { Router } from 'express';
import {
  sendConnectionRequest,
  respondConnectionRequest,
  getConnectionStatus,
  getPendingRequests,
  getConnections
} from '../controllers/connectionController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/request', authenticateJWT, sendConnectionRequest);
router.post('/respond', authenticateJWT, respondConnectionRequest);
router.get('/status/:targetUserId', authenticateJWT, getConnectionStatus);
router.get('/pending', authenticateJWT, getPendingRequests);
router.get('/', authenticateJWT, getConnections);

export default router;
