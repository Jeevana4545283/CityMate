import { Router } from 'express';
import { getGames, getGameById, createGame, joinGame, leaveGame } from '../controllers/sportsController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/games', getGames);
router.get('/games/:id', getGameById);
router.post('/games', authenticateJWT, createGame);
router.post('/games/:id/join', authenticateJWT, joinGame);
router.delete('/games/:id/leave', authenticateJWT, leaveGame);

export default router;
