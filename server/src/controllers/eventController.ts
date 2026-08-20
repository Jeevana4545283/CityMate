import { Response, Request } from 'express';
import { Event } from '../models/Event';
import { EventPartnerRequest } from '../models/EventPartnerRequest';
import { Connection } from '../models/Connection';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { Server as SocketIOServer } from 'socket.io';

const notifyUser = async (req: AuthRequest, userId: string, message: string, link: string) => {
  await Notification.create({
    user: userId,
    type: 'System',
    message,
    link,
    read: false
  });
  const io = req.app.get('io') as SocketIOServer;
  if (io) {
    io.to(`user_${userId}`).emit('notification_received', { type: 'System', message, userId });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { title, description, category, date, startTime, endTime, location, city, maxParticipants } = req.body;
    
    const event = new Event({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      city,
      organizer: req.user.id,
      maxParticipants,
      participants: [req.user.id] // Organizer joins by default
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { category, city, search } = req.query;
    let filter: any = {};
    if (category && category !== 'All' && category !== 'ALL') filter.category = category;
    if (city) filter.city = new RegExp(city as string, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search as string, 'i') },
        { location: new RegExp(search as string, 'i') }
      ];
    }
    const events = await Event.find(filter).populate('organizer', 'name profilePhoto').sort({ date: 1 });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name profilePhoto email')
      .populate('participants', 'name profilePhoto');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyEvents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const events = await Event.find({ organizer: req.user.id }).populate('organizer', 'name profilePhoto').sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJoinedEvents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const events = await Event.find({ participants: req.user.id }).populate('organizer', 'name profilePhoto').sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only organizer can edit this event' });
    }
    
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only organizer can delete this event' });
    }
    
    // Notify participants
    for (const p of event.participants) {
      if (p.toString() !== req.user.id) {
        await notifyUser(req, p.toString(), `The event '${event.title}' has been cancelled.`, '/events');
      }
    }
    
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.participants.includes(req.user.id as any)) {
      return res.status(400).json({ message: 'Already joined this event' });
    }
    
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event Full' });
    }
    
    event.participants.push(req.user.id as any);
    await event.save();
    
    if (event.organizer.toString() !== req.user.id) {
      await notifyUser(req, event.organizer.toString(), `${req.user.name} joined your event: ${event.title}.`, `/events/${event._id}`);
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const leaveEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.organizer.toString() === req.user.id) {
      return res.status(400).json({ message: 'Organizer cannot leave their own event' });
    }
    
    event.participants = event.participants.filter(p => p.toString() !== req.user.id);
    await event.save();
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAvailableEventPartners = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const event = await Event.findById(req.params.id).populate('participants', 'name profilePhoto city');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // User must be a participant
    const isParticipant = event.participants.some((p: any) => p._id.toString() === req.user!.id);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You must join the event first to find partners.' });
    }
    
    // Get all existing requests involving current user for this event
    const existingRequests = await EventPartnerRequest.find({
      event: event._id,
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    });
    const connectedOrPendingIds = new Set(existingRequests.map(r => 
      r.sender.toString() === req.user!.id ? r.receiver.toString() : r.sender.toString()
    ));
    
    // Filter out current user and already requested users
    const available = event.participants.filter((p: any) => 
      p._id.toString() !== req.user!.id && !connectedOrPendingIds.has(p._id.toString())
    );
    
    res.json(available);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendEventPartnerRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { targetUserId } = req.body;
    
    if (req.user.id === targetUserId) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }
    
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    const isSenderParticipant = event.participants.some((p: any) => p._id.toString() === req.user!.id);
    const isTargetParticipant = event.participants.some((p: any) => p._id.toString() === targetUserId);
    
    if (!isSenderParticipant || !isTargetParticipant) {
      return res.status(400).json({ message: 'Both users must be participants of the event' });
    }
    
    const existing = await EventPartnerRequest.findOne({
      event: event._id,
      $or: [
        { sender: req.user.id, receiver: targetUserId },
        { sender: targetUserId, receiver: req.user.id }
      ]
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Request already exists' });
    }
    
    const request = new EventPartnerRequest({
      event: event._id,
      sender: req.user.id,
      receiver: targetUserId,
      status: 'PENDING'
    });
    await request.save();
    
    await notifyUser(req, targetUserId, `${req.user.name} wants to attend ${event.title} with you.`, `/events`);
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventPartnerRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const incoming = await EventPartnerRequest.find({ receiver: req.user.id })
      .populate('sender', 'name profilePhoto')
      .populate('event', 'title date');
      
    const sent = await EventPartnerRequest.find({ sender: req.user.id })
      .populate('receiver', 'name profilePhoto')
      .populate('event', 'title date');
      
    res.json({ incoming, sent });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptEventPartnerRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const request = await EventPartnerRequest.findById(req.params.id).populate('event', 'title');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request is not pending' });
    }
    
    request.status = 'ACCEPTED';
    await request.save();
    
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: request.sender, receiver: request.receiver },
        { sender: request.receiver, receiver: request.sender }
      ]
    });
    
    if (existingConnection) {
      if (existingConnection.status !== 'Accepted') {
        existingConnection.status = 'Accepted';
        await existingConnection.save();
      }
    } else {
      await Connection.create({
        sender: request.receiver,
        receiver: request.sender,
        status: 'Accepted'
      });
    }
    
    const eventAny = request.event as any;
    await notifyUser(req, request.sender.toString(), `${req.user.name} accepted your event partner request for ${eventAny.title}.`, `/events`);
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectEventPartnerRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    
    const request = await EventPartnerRequest.findById(req.params.id).populate('event', 'title');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    request.status = 'REJECTED';
    await request.save();
    
    const eventAny = request.event as any;
    await notifyUser(req, request.sender.toString(), `${req.user.name} rejected your event partner request for ${eventAny.title}.`, `/events`);
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
