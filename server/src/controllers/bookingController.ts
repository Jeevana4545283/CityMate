import { Response } from 'express';
import { Booking } from '../models/Booking';
import { Property } from '../models/Property';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { Connection } from '../models/Connection';
import { AuthRequest } from '../middleware/auth';
import { Server as SocketIOServer } from 'socket.io';

const notifyUser = async (req: AuthRequest, userId: string, message: string, link: string) => {
  await Notification.create({
    user: userId,
    type: 'BookingUpdate',
    message,
    link,
    read: false
  });
  const io = req.app.get('io') as SocketIOServer;
  if (io) {
    io.to(`user_${userId}`).emit('notification_received', { type: 'BookingUpdate', message, userId });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, moveInDate, rentAgreed, depositAgreed } = req.body;
    const requesterId = req.user?.id;

    if (!requesterId) return res.status(401).json({ message: 'Unauthorized' });

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    if (property.owner.toString() === requesterId) {
      return res.status(400).json({ message: 'You cannot book your own property' });
    }

    if (property.availability !== 'Available') {
      return res.status(400).json({ message: 'Property is not available for booking' });
    }

    const existingBooking = await Booking.findOne({
      property: propertyId,
      requester: requesterId,
      status: 'PENDING'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a pending booking request for this property' });
    }

    const booking = await Booking.create({
      property: propertyId,
      owner: property.owner,
      requester: requesterId,
      moveInDate,
      rentAgreed,
      depositAgreed,
      status: 'PENDING'
    });

    const requesterUser = await User.findById(req.user.id);
    await notifyUser(
      req, 
      property.owner.toString(), 
      `${requesterUser?.name || 'Someone'} requested to book your property: ${property.title}.`,
      '/booking-requests'
    );

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking request', error: (error as Error).message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const bookings = await Booking.find({ requester: req.user.id })
      .populate('property')
      .populate('owner', 'name email phone profilePhoto')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your bookings' });
  }
};

export const getBookingRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const requests = await Booking.find({ owner: req.user.id })
      .populate('property')
      .populate('requester', 'name email phone profilePhoto')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking requests' });
  }
};

export const acceptBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending bookings can be accepted' });
    }

    const property: any = booking.property;
    if (property.availability !== 'Available') {
      return res.status(400).json({ message: 'Property is already booked or occupied' });
    }

    booking.status = 'ACCEPTED';
    await booking.save();

    await Property.findByIdAndUpdate(property._id, { availability: 'Occupied' });

    // Reject other pending requests for this property
    await Booking.updateMany(
      { property: property._id, status: 'PENDING', _id: { $ne: booking._id } },
      { status: 'REJECTED' }
    );

    // Automatically create or update connection to Accepted for chat access
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: booking.owner, receiver: booking.requester },
        { sender: booking.requester, receiver: booking.owner }
      ]
    });

    if (existingConnection) {
      if (existingConnection.status !== 'Accepted') {
        existingConnection.status = 'Accepted';
        await existingConnection.save();
      }
    } else {
      await Connection.create({
        sender: booking.owner,
        receiver: booking.requester,
        status: 'Accepted'
      });
    }

    await notifyUser(
      req, 
      booking.requester.toString(), 
      `Your booking request for ${property.title} has been ACCEPTED.`,
      '/my-bookings'
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting booking' });
  }
};

export const rejectBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending bookings can be rejected' });
    }

    booking.status = 'REJECTED';
    await booking.save();

    const property: any = booking.property;
    await notifyUser(
      req, 
      booking.requester.toString(), 
      `Your booking request for ${property.title} has been REJECTED.`,
      '/my-bookings'
    );

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting booking' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.requester.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};
