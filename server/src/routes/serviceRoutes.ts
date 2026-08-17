import { Router } from 'express';
import {
  getServiceProviders,
  getServiceProviderById,
  createBooking,
  getMyBookings,
  updateBookingStatus,
  updateProviderStatus
} from '../controllers/serviceController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/providers', getServiceProviders);
router.get('/providers/:id', getServiceProviderById);
router.put('/providers/status', authenticateJWT, updateProviderStatus);

router.post('/bookings', authenticateJWT, createBooking);
router.get('/bookings', authenticateJWT, getMyBookings);
router.put('/bookings/:id/status', authenticateJWT, updateBookingStatus);

export default router;
