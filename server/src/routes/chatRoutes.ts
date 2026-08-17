import { Router } from 'express';
import { getConversations, getMessagesWithUser, sendMessage } from '../controllers/chatController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/conversations', authenticateJWT, getConversations);
router.get('/:userId', authenticateJWT, getMessagesWithUser);
router.post('/', authenticateJWT, sendMessage);

export default router;
