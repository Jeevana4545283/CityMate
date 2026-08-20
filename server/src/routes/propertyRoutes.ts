import { Router } from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getMyListings } from '../controllers/propertyController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/my-listings', authenticateJWT, getMyListings);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', authenticateJWT, createProperty);
router.put('/:id', authenticateJWT, updateProperty);
router.delete('/:id', authenticateJWT, deleteProperty);

export default router;
