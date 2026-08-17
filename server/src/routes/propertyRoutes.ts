import { Router } from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty } from '../controllers/propertyController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', authenticateJWT, authorizeRoles('PROPERTY_OWNER', 'ADMIN'), createProperty);
router.put('/:id', authenticateJWT, updateProperty);

export default router;
