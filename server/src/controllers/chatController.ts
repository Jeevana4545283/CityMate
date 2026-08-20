import { Response } from 'express';
import { Message } from '../models/Message';
import { Connection } from '../models/Connection';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { Booking } from '../models/Booking';
import { AuthRequest } from '../middleware/auth';

// Helper function to verify accepted connection safely
async function checkAcceptedConnection(user1Id: string, user2Id: string): Promise<boolean> {
  const connection = await Connection.findOne({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id }
    ],
    status: 'Accepted'
  });
  if (connection) return true;

  // Dynamically check for accepted bookings between these two users
  const booking = await Booking.findOne({
    $or: [
      { owner: user1Id, requester: user2Id },
      { owner: user2Id, requester: user1Id }
    ],
    status: 'ACCEPTED'
  });

  return !!booking;
}

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const currentUserId = req.user.id.toString();

    // 1. Get all accepted connections for this user
    const connections = await Connection.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      status: 'Accepted'
    }).populate('sender receiver', '-password');

    // 1.5 Get all accepted bookings for this user
    const bookings = await Booking.find({
      $or: [{ owner: currentUserId }, { requester: currentUserId }],
      status: 'ACCEPTED'
    }).populate('owner requester', '-password');

    // Merge connections and bookings into a unified list of partners
    const partnersMap = new Map();

    connections.forEach((conn) => {
      const partner = conn.sender._id.toString() === currentUserId ? conn.receiver : conn.sender;
      partnersMap.set(partner._id.toString(), { partner, sourceId: conn._id, type: 'Connection', updatedAt: conn.updatedAt });
    });

    bookings.forEach((booking) => {
      const partner = booking.owner._id.toString() === currentUserId ? booking.requester : booking.owner;
      if (!partnersMap.has(partner._id.toString())) {
        partnersMap.set(partner._id.toString(), { partner, sourceId: booking._id, type: 'Booking', updatedAt: booking.updatedAt });
      }
    });

    const unifiedConnections = Array.from(partnersMap.values());

    // 2. Map connected partners safely
    const conversationList = await Promise.all(
      unifiedConnections.map(async ({ partner, sourceId, type, updatedAt }) => {
        if (!partner) return null;

        const partnerId = (partner as any)._id ? (partner as any)._id.toString() : partner.toString();

        // Get last message between currentUserId and partnerId
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: partnerId },
            { sender: partnerId, receiver: currentUserId }
          ]
        }).sort({ createdAt: -1 });

        // Get unread count from partner to currentUserId
        const unreadCount = await Message.countDocuments({
          sender: partnerId,
          receiver: currentUserId,
          read: false
        });

        return {
          partner,
          connectionId: sourceId,
          lastMessage: lastMessage ? lastMessage.content : 'Connection accepted! Start a conversation.',
          lastMessageTime: lastMessage ? lastMessage.createdAt : updatedAt,
          unreadCount
        };
      })
    );

    const validConversations = conversationList.filter(Boolean);

    validConversations.sort(
      (a: any, b: any) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    res.json(validConversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

export const getMessagesWithUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const otherUserId = req.params.userId.toString();
    const currentUserId = req.user.id.toString();

    // Security Check: Enforce Accepted Connection
    const isConnected = await checkAcceptedConnection(currentUserId, otherUserId);
    if (!isConnected) {
      return res.status(403).json({
        message: 'Chat access allowed only for connected users with an accepted request.'
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages from otherUserId to currentUserId as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { $set: { read: true, status: 'READ' } }
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { receiverId, content } = req.body;
    const senderId = req.user.id.toString();

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    // Security Check: Enforce Accepted Connection
    const isConnected = await checkAcceptedConnection(senderId, receiverId);
    if (!isConnected) {
      return res.status(403).json({
        message: 'Cannot send message. Connection request must be accepted first.'
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
      read: false,
      status: 'SENT'
    });

    const senderUser = await User.findById(senderId);

    // Create Notification for receiver
    await Notification.create({
      user: receiverId,
      type: 'Message',
      message: `You have a new message from ${senderUser?.name || 'a contact'}.`,
      link: `/messages?userId=${senderId}`,
      read: false
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
};
