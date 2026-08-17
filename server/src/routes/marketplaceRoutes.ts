import { Router } from 'express';
import { getMarketplaceItems, createMarketplaceItem } from '../controllers/marketplaceController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/', getMarketplaceItems);
router.post('/', authenticateJWT, createMarketplaceItem);

export default router;
