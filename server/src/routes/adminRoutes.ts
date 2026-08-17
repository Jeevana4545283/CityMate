import { Router } from 'express';
import { getAdminStats, verifyProvider } from '../controllers/adminController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateJWT, authorizeRoles('ADMIN'), getAdminStats);
router.put('/verify-provider/:id', authenticateJWT, authorizeRoles('ADMIN'), verifyProvider);

export default router;
