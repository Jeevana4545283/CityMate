import { Router } from 'express';
import { getUsers, getUserById, getNearbyUsers, updateUserProfile } from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/', getUsers);
router.get('/nearby', authenticateJWT, getNearbyUsers);
router.get('/:id', getUserById);
router.put('/:id', authenticateJWT, updateUserProfile);

export default router;
