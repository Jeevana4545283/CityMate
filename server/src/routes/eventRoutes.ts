import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  getJoinedEvents,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getAvailableEventPartners,
  sendEventPartnerRequest,
  getEventPartnerRequests,
  acceptEventPartnerRequest,
  rejectEventPartnerRequest
} from '../controllers/eventController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.get('/', getEvents);
router.get('/my-events', authenticateJWT, getMyEvents);
router.get('/joined', authenticateJWT, getJoinedEvents);
router.get('/partner-requests/me', authenticateJWT, getEventPartnerRequests);
router.get('/:id', getEventById);
router.get('/:id/available-partners', authenticateJWT, getAvailableEventPartners);

router.post('/', authenticateJWT, createEvent);
router.put('/:id', authenticateJWT, updateEvent);
router.delete('/:id', authenticateJWT, deleteEvent);

router.post('/:id/join', authenticateJWT, joinEvent);
router.delete('/:id/leave', authenticateJWT, leaveEvent);

router.post('/:id/partner-requests', authenticateJWT, sendEventPartnerRequest);
router.post('/partner-requests/:id/accept', authenticateJWT, acceptEventPartnerRequest);
router.post('/partner-requests/:id/reject', authenticateJWT, rejectEventPartnerRequest);

export default router;
