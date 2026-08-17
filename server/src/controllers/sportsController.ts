import { Request, Response } from 'express';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { calculatePlayerMatch } from '../services/matchingService';

export const getGames = async (req: Request, res: Response) => {
  try {
    const { sport, city, area, skillLevel } = req.query;
    let query: any = {};

    if (sport && sport !== 'All') query.sport = sport;
    if (city) query.city = new RegExp(city as string, 'i');
    if (area) query.area = new RegExp(area as string, 'i');
    if (skillLevel && skillLevel !== 'All Levels') query.skillLevel = skillLevel;

    const games = await Game.find(query)
      .populate('host', 'name email profilePhoto age city area')
      .populate('playersJoined', 'name profilePhoto age')
      .sort({ date: 1 });

    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sports games' });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('host', 'name email profilePhoto age city area sports')
      .populate('playersJoined', 'name profilePhoto age sports');

    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game details' });
  }
};

export const createGame = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const game = await Game.create({
      ...req.body,
      host: req.user.id,
      playersJoined: [req.user.id]
    });

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sports game', error: (error as Error).message });
  }
};

export const joinGame = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    const isAlreadyJoined = game.playersJoined.some(p => p.toString() === req.user?.id);
    if (isAlreadyJoined) {
      return res.status(400).json({ message: 'You have already joined this game' });
    }

    if (game.playersJoined.length >= game.maxPlayers) {
      return res.status(400).json({ message: 'Game is already full' });
    }

    game.playersJoined.push(req.user.id as any);
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error joining game' });
  }
};

export const leaveGame = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    game.playersJoined = game.playersJoined.filter(p => p.toString() !== req.user?.id);
    await game.save();

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error leaving game' });
  }
};
