import { Router } from 'express';
import { getCommunities, joinCommunity, getPosts, createPost, addComment } from '../controllers/communityController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/communities', getCommunities);
router.post('/communities/:id/join', authenticateJWT, joinCommunity);

router.get('/posts', getPosts);
router.post('/posts', authenticateJWT, createPost);
router.post('/posts/:id/comments', authenticateJWT, addComment);

export default router;
