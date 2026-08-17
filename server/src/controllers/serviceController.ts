import { Request, Response } from 'express';
import { ServiceProvider } from '../models/ServiceProvider';
import { ServiceBooking } from '../models/ServiceBooking';
import { AuthRequest } from '../middleware/auth';
import { calculateHaversineDistance } from '../services/locationService';

export const getServiceProviders = async (req: Request, res: Response) => {
  try {
    const { category, city, area, search } = req.query;
    let query: any = {};

    if (category && category !== 'All') query.category = category;
    if (city) query.city = new RegExp(city as string, 'i');
    if (area) query.area = new RegExp(area as string, 'i');
    if (search) {
      query.$or = [
        { businessName: new RegExp(search as string, 'i') },
        { category: new RegExp(search as string, 'i') },
        { services: new RegExp(search as string, 'i') }
      ];
    }

    const providers = await ServiceProvider.find(query).populate('user', 'name email profilePhoto');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service providers' });
  }
};

export const getServiceProviderById = async (req: Request, res: Response) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).populate('user', 'name email profilePhoto');
    if (!provider) return res.status(404).json({ message: 'Service provider not found' });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service provider details' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { providerId, serviceCategory, problemDescription, bookingDate, bookingTimeSlot, locationAddress, area, city, estimatedCost } = req.body;

    const booking = await ServiceBooking.create({
      user: req.user.id,
      provider: providerId,
      serviceCategory,
      problemDescription,
      bookingDate,
      bookingTimeSlot,
      locationAddress,
      area: area || 'Gachibowli',
      city: city || 'Hyderabad',
      estimatedCost: estimatedCost || 350,
      status: 'Requested'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service booking', error: (error as Error).message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // Check if user is a service provider
    const provider = await ServiceProvider.findOne({ user: req.user.id });

    let bookings;
    if (provider) {
      // Return bookings where provider is assigned
      bookings = await ServiceBooking.find({ provider: provider._id })
        .populate('user', 'name email phone profilePhoto')
        .populate('provider')
        .sort({ createdAt: -1 });
    } else {
      // Return bookings created by user
      bookings = await ServiceBooking.find({ user: req.user.id })
        .populate('provider')
        .sort({ createdAt: -1 });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, workerName, workerPhone } = req.body;
    const booking = await ServiceBooking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    if (workerName) booking.workerName = workerName;
    if (workerPhone) booking.workerPhone = workerPhone;

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status' });
  }
};

export const updateProviderStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { availabilityStatus } = req.body;
    const provider = await ServiceProvider.findOneAndUpdate(
      { user: req.user.id },
      { availabilityStatus },
      { new: true }
    );

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error updating provider availability status' });
  }
};
