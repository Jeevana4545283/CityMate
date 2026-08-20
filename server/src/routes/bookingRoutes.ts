import { Router } from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getBookingRequests, 
  acceptBooking, 
  rejectBooking, 
  cancelBooking 
} from '../controllers/bookingController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/', authenticateJWT, createBooking);
router.get('/my-bookings', authenticateJWT, getMyBookings);
router.get('/requests', authenticateJWT, getBookingRequests);
router.put('/:id/accept', authenticateJWT, acceptBooking);
router.put('/:id/reject', authenticateJWT, rejectBooking);
router.delete('/:id/cancel', authenticateJWT, cancelBooking);

export default router;
