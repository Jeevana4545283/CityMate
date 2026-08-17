import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { calculatePlayerMatch } from '../services/matchingService';
import { calculateHaversineDistance } from '../services/locationService';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { city, area, sport, interest } = req.query;
    let query: any = {};

    if (city) query.city = new RegExp(city as string, 'i');
    if (area) query.area = new RegExp(area as string, 'i');
    if (sport) query['sports.sport'] = new RegExp(sport as string, 'i');
    if (interest) query.interests = { $in: [interest as string] };

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const getNearbyUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = req.user ? await User.findById(req.user.id) : null;
    const city = req.query.city as string || currentUser?.city || 'Hyderabad';
    const area = req.query.area as string || currentUser?.area || 'Gachibowli';

    const users = await User.find({
      _id: { $ne: currentUser?._id },
      city: new RegExp(city, 'i')
    }).select('-password');

    const result = users.map(u => {
      const distance = calculateHaversineDistance(
        currentUser?.latitude || 17.4401,
        currentUser?.longitude || 78.3489,
        u.latitude || 17.4401,
        u.longitude || 78.3489
      );

      const matchInfo = currentUser
        ? calculatePlayerMatch(currentUser.toObject(), u.toObject(), req.query.sport as string || 'Badminton')
        : { score: 85, reasons: ['Same city', 'Nearby area'] };

      return {
        ...u.toObject(),
        distance,
        matchScore: matchInfo.score,
        matchReasons: matchInfo.reasons
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby users' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
};
