import { Router } from 'express';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllRead
} from '../controllers/notificationController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, getNotifications);
router.get('/unread-count', authenticateJWT, getUnreadCount);
router.put('/mark-all-read', authenticateJWT, markAllRead);
router.put('/:id/read', authenticateJWT, markNotificationRead);

export default router;
