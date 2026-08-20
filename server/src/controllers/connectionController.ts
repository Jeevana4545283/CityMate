import { Response } from 'express';
import { Connection } from '../models/Connection';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

function getUserIdString(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (val._id) return val._id.toString();
  return val.toString();
}

export const sendConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const senderId = req.user.id.toString();
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    if (senderId === receiverId.toString()) {
      return res.status(400).json({ message: 'Cannot send connection request to yourself' });
    }

    const receiverUser = await User.findById(receiverId);
    if (!receiverUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const senderUser = await User.findById(senderId);

    // Check existing connection
    let existing = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existing) {
      if (existing.status === 'Accepted') {
        return res.status(400).json({ message: 'Already connected with this user' });
      }
      if (existing.status === 'Pending') {
        return res.status(400).json({ message: 'Connection request already pending' });
      }
      existing.sender = senderId as any;
      existing.receiver = receiverId as any;
      existing.status = 'Pending';
      await existing.save();
    } else {
      existing = await Connection.create({
        sender: senderId,
        receiver: receiverId,
        status: 'Pending'
      });
    }

    // Create Notification for receiver
    await Notification.create({
      user: receiverId,
      type: 'ConnectionRequest',
      message: `${senderUser?.name || 'A user'} sent you a connection request.`,
      link: `/notifications?connectionId=${existing._id}`,
      read: false
    });

    // Real-Time Socket.IO notification to receiver
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiverId}`).emit('notification_received', { 
        userId: receiverId.toString(),
        type: 'ConnectionRequest',
        message: `${senderUser?.name || 'A user'} sent you a connection request.`
      });
      io.to(`user_${receiverId}`).emit('connection_updated', {
        connectionId: existing._id.toString(),
        status: 'Pending_Received',
        partnerId: senderId
      });
    }

    res.status(201).json({
      message: 'Connection request sent',
      connection: existing
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending connection request' });
  }
};

export const respondConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const currentUserId = req.user.id.toString();
    const { connectionId, action } = req.body; // action: 'Accept' | 'Reject'

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    const connSenderId = getUserIdString(connection.sender);
    const connReceiverId = getUserIdString(connection.receiver);

    // Only receiver can accept/reject (or sender if canceling)
    if (connReceiverId !== currentUserId && connSenderId !== currentUserId) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    const acceptorUser = await User.findById(currentUserId);
    const targetUserId = connSenderId === currentUserId ? connReceiverId : connSenderId;

    if (action === 'Accept') {
      connection.status = 'Accepted';
      await connection.save();

      // Create Notification for sender
      await Notification.create({
        user: targetUserId,
        type: 'ConnectionAccepted',
        message: `${acceptorUser?.name || 'A user'} accepted your connection request! You can now chat.`,
        link: `/messages?userId=${currentUserId}`,
        read: false
      });

      // Real-Time Socket.IO update to both users
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${targetUserId}`).emit('connection_updated', {
          connectionId: connection._id.toString(),
          status: 'Accepted',
          partnerId: currentUserId
        });
        io.to(`user_${targetUserId}`).emit('notification_received', { userId: targetUserId,
          type: 'ConnectionAccepted',
          message: `${acceptorUser?.name || 'A user'} accepted your connection request!`
        });

        io.to(`user_${currentUserId}`).emit('connection_updated', {
          connectionId: connection._id.toString(),
          status: 'Accepted',
          partnerId: targetUserId
        });
      }

      return res.json({ message: 'Connection accepted', connection });
    } else {
      connection.status = 'Rejected';
      await connection.save();

      // Create Notification for sender
      await Notification.create({
        user: targetUserId,
        type: 'System',
        message: `${acceptorUser?.name || 'A user'} declined your connection request.`,
        link: `/notifications`,
        read: false
      });

      const io = req.app.get('io');
      if (io) {
        io.to(`user_${targetUserId}`).emit('connection_updated', {
          connectionId: connection._id.toString(),
          status: 'Rejected',
          partnerId: currentUserId
        });
        io.to(`user_${targetUserId}`).emit('notification_received', { userId: targetUserId,
          type: 'System',
          message: `${acceptorUser?.name || 'A user'} declined your connection request.`
        });
      }

      return res.json({ message: 'Connection rejected', connection });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error responding to connection request' });
  }
};

export const getConnectionStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const currentUserId = req.user.id.toString();
    const targetUserId = req.params.targetUserId.toString();

    const conn = await Connection.findOne({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId }
      ]
    });

    if (!conn) {
      return res.json({ status: 'None', connectionId: null });
    }

    if (conn.status === 'Accepted') {
      return res.json({ status: 'Accepted', connectionId: conn._id });
    }

    const connSenderId = getUserIdString(conn.sender);

    if (conn.status === 'Pending') {
      if (connSenderId === currentUserId) {
        return res.json({ status: 'Pending_Sent', connectionId: conn._id });
      } else {
        return res.json({ status: 'Pending_Received', connectionId: conn._id });
      }
    }

    res.json({ status: conn.status, connectionId: conn._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching connection status' });
  }
};

export const getPendingRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const requests = await Connection.find({
      receiver: req.user.id,
      status: 'Pending'
    }).populate('sender', '-password');

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching pending connection requests' });
  }
};

export const getConnections = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const currentUserId = req.user.id.toString();

    const connections = await Connection.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      status: 'Accepted'
    }).populate('sender receiver', '-password');

    res.json(connections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching connections' });
  }
};
