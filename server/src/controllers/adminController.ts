import { Request, Response } from 'express';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { ServiceProvider } from '../models/ServiceProvider';
import { ServiceBooking } from '../models/ServiceBooking';
import { Game } from '../models/Game';
import { Community } from '../models/Community';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const serviceProviders = await ServiceProvider.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await ServiceBooking.countDocuments();
    const totalGames = await Game.countDocuments();
    const totalCommunities = await Community.countDocuments();
    const pendingVerifications = await ServiceProvider.countDocuments({ verificationStatus: 'Pending' });

    res.json({
      totalUsers,
      serviceProviders,
      totalProperties,
      totalBookings,
      totalGames,
      totalCommunities,
      pendingVerifications,
      activeUsers: Math.round(totalUsers * 0.75)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin metrics' });
  }
};

export const verifyProvider = async (req: Request, res: Response) => {
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: req.body.status || 'Verified' },
      { new: true }
    );
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error updating provider verification status' });
  }
};
