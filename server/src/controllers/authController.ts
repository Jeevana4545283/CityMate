import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'citymate_super_secret_jwt_key_2026';

// Passwordless Login / Auto-Registration Handler
export const passwordlessAuth = async (req: Request, res: Response) => {
  try {
    const { name, email, city, area } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // 1. Create new user account automatically in MongoDB
      const displayName = name && name.trim() ? name.trim() : normalizedEmail.split('@')[0];
      
      user = await User.create({
        name: displayName,
        email: normalizedEmail,
        city: city || 'Hyderabad',
        area: area || 'Gachibowli',
        role: 'USER',
        interests: ['Sports', 'Technology', 'Community', 'Food'],
        sports: [
          {
            sport: 'Badminton',
            skillLevel: 'Intermediate',
            playingStyle: 'Doubles',
            preferredTime: 'Evening',
            availableDays: ['Saturday', 'Sunday']
          }
        ],
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        age: 24,
        gender: 'Male'
      });
      console.log(`[Auth] New user created in database: ${user.name} (${user.email})`);
    } else {
      // 2. Existing user found: update name if changed
      if (name && name.trim() && user.name !== name.trim()) {
        user.name = name.trim();
        await user.save();
      }
      console.log(`[Auth] Existing user logged in: ${user.name} (${user.email})`);
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        area: user.area,
        role: user.role,
        profilePhoto: user.profilePhoto,
        interests: user.interests,
        sports: user.sports,
        age: user.age,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('[Auth Error]:', error);
    res.status(500).json({ message: 'Server error during authentication', error: (error as Error).message });
  }
};

export const register = passwordlessAuth;
export const login = passwordlessAuth;

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};
