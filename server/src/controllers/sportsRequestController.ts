import { Response } from 'express';
import { SportsRequest } from '../models/SportsRequest';
import { Game } from '../models/Game';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { Connection } from '../models/Connection';
import { AuthRequest } from '../middleware/auth';
import { Server as SocketIOServer } from 'socket.io';

const notifyUser = async (req: AuthRequest, userId: string, message: string, link: string) => {
  await Notification.create({
    user: userId,
    type: 'SportsRequest',
    message,
    link,
    read: false
  });
  const io = req.app.get('io') as SocketIOServer;
  if (io) {
    io.to(`user_${userId}`).emit('notification_received', { type: 'SportsRequest', message, userId });
  }
};

export const sendSportsRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const post = await Game.findById(postId);
    if (!post) return res.status(404).json({ message: 'Sports post not found' });

    if (post.host.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot send a request to your own post' });
    }

    const existingRequest = await SportsRequest.findOne({
      post: postId,
      sender: req.user.id,
      status: 'PENDING'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this post' });
    }

    const request = await SportsRequest.create({
      post: postId,
      sender: req.user.id,
      receiver: post.host,
      status: 'PENDING'
    });

    const senderUser = await User.findById(req.user.id);
    await notifyUser(
      req,
      post.host.toString(),
      `${senderUser?.name || 'Someone'} sent you a sports partner request for ${post.sport}.`,
      '/sports' // Link to sports requests page (we'll implement this UI)
    );

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error sending request', error: (error as Error).message });
  }
};

export const getMySentRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const requests = await SportsRequest.find({ sender: req.user.id })
      .populate('post')
      .populate('receiver', 'name email phone profilePhoto')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your requests' });
  }
};

export const getReceivedRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const requests = await SportsRequest.find({ receiver: req.user.id })
      .populate('post')
      .populate('sender', 'name email phone profilePhoto')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching received requests' });
  }
};

export const acceptRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const request = await SportsRequest.findById(req.params.id).populate('post');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending requests can be accepted' });
    }

    request.status = 'ACCEPTED';
    await request.save();

    // Automatically create or update connection to Accepted for chat access
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: request.receiver, receiver: request.sender },
        { sender: request.sender, receiver: request.receiver }
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

    const post: any = request.post;
    await notifyUser(
      req,
      request.sender.toString(),
      `Your sports partner request for ${post?.sport || 'a game'} has been ACCEPTED.`,
      '/sports'
    );

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting request' });
  }
};

export const rejectRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const request = await SportsRequest.findById(req.params.id).populate('post');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending requests can be rejected' });
    }

    request.status = 'REJECTED';
    await request.save();

    const post: any = request.post;
    await notifyUser(
      req,
      request.sender.toString(),
      `Your sports partner request for ${post?.sport || 'a game'} has been REJECTED.`,
      '/sports'
    );

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request' });
  }
};

export const cancelRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const request = await SportsRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }

    request.status = 'CANCELLED';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling request' });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const games = await Game.find({ host: req.user.id }).sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your posts' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const post = await Game.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Game.findByIdAndDelete(req.params.id);
    // Optionally cancel pending requests for this post
    await SportsRequest.updateMany({ post: req.params.id, status: 'PENDING' }, { status: 'CANCELLED' });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};
