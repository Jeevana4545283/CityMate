import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import { verifyToken } from './middleware/auth';
import { Connection } from './models/Connection';
import { Message } from './models/Message';
import { User } from './models/User';
import { Notification } from './models/Notification';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Attach io to Express app for controller access
app.set('io', io);

// Online User Tracker Map (userId -> socketId)
const onlineUsers = new Map<string, string>();

function getConversationRoomId(user1Id: string, user2Id: string): string {
  const sorted = [user1Id.toString(), user2Id.toString()].sort();
  return `conversation:${sorted[0]}_${sorted[1]}`;
}

// Socket.IO JWT Authentication Middleware
io.use((socket, next) => {
  try {
    let token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token && socket.handshake.headers.authorization?.startsWith('Bearer ')) {
      token = socket.handshake.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const queryUserId = socket.handshake.query?.userId as string;
      if (queryUserId) {
        (socket as any).userId = queryUserId;
        return next();
      }
      return next(new Error('Authentication error: Missing token'));
    }

    const decoded = verifyToken(token as string);
    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }

    (socket as any).userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = (socket as any).userId;
  console.log(`[Socket] Connected: ${socket.id} (User: ${userId})`);

  if (userId) {
    onlineUsers.set(userId.toString(), socket.id);
    socket.join(`user_${userId}`);
    
    // Broadcast user_online to all connected clients
    io.emit('user_online', { userId: userId.toString() });
  }

  // 1. Join Conversation Room
  socket.on('join_conversation', async ({ partnerId }) => {
    if (!userId || !partnerId) return;

    // Verify Accepted Connection in MongoDB
    const isConnected = await Connection.findOne({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId }
      ],
      status: 'Accepted'
    });

    if (!isConnected) {
      return socket.emit('chat_error', { message: 'Chat access allowed only for connected users.' });
    }

    const roomId = getConversationRoomId(userId, partnerId);
    socket.join(roomId);
    console.log(`[Socket] User ${userId} joined room ${roomId}`);

    // Mark unread messages from partner as READ in MongoDB
    const updated = await Message.updateMany(
      { sender: partnerId, receiver: userId, read: false },
      { $set: { read: true, status: 'READ', readAt: new Date() } }
    );

    if (updated.modifiedCount > 0) {
      io.to(roomId).emit('messages_read', { readerId: userId, partnerId });
      io.to(`user_${partnerId}`).emit('messages_read', { readerId: userId, partnerId });
    }
  });

  // 2. Leave Conversation Room
  socket.on('leave_conversation', ({ partnerId }) => {
    if (!userId || !partnerId) return;
    const roomId = getConversationRoomId(userId, partnerId);
    socket.leave(roomId);
    console.log(`[Socket] User ${userId} left room ${roomId}`);
  });

  // 3. Send Real-Time Message Event
  socket.on('send_message', async ({ receiverId, content }, ackCallback) => {
    try {
      if (!userId || !receiverId || !content || !content.trim()) return;

      // Security Check: Enforce Accepted Connection in MongoDB
      const isConnected = await Connection.findOne({
        $or: [
          { sender: userId, receiver: receiverId },
          { sender: receiverId, receiver: userId }
        ],
        status: 'Accepted'
      });

      if (!isConnected) {
        return socket.emit('chat_error', { message: 'Cannot send message. Connection request must be accepted first.' });
      }

      const isReceiverOnline = onlineUsers.has(receiverId.toString());
      const initialStatus = isReceiverOnline ? 'DELIVERED' : 'SENT';

      // Save message in MongoDB
      const message = await Message.create({
        sender: userId,
        receiver: receiverId,
        content: content.trim(),
        read: false,
        status: initialStatus,
        deliveredAt: isReceiverOnline ? new Date() : undefined
      });

      const senderUser = await User.findById(userId);

      // Create Notification for receiver
      await Notification.create({
        user: receiverId,
        type: 'Message',
        message: `You have a new message from ${senderUser?.name || 'a contact'}.`,
        link: `/messages?userId=${userId}`,
        read: false
      });

      const messageData = {
        _id: message._id.toString(),
        sender: userId.toString(),
        receiver: receiverId.toString(),
        content: message.content,
        status: message.status,
        read: message.read,
        createdAt: message.createdAt.toISOString()
      };

      // Emit to conversation room & receiver's personal user room
      const roomId = getConversationRoomId(userId, receiverId);
      io.to(roomId).emit('receive_message', messageData);
      io.to(`user_${receiverId}`).emit('receive_message', messageData);
      io.to(`user_${receiverId}`).emit('notification_received', {
        type: 'Message',
        message: `New message from ${senderUser?.name || 'a contact'}`,
        userId: receiverId.toString()
      });

      if (typeof ackCallback === 'function') {
        ackCallback({ success: true, message: messageData });
      }
    } catch (err) {
      console.error('[Socket] Error in send_message:', err);
    }
  });

  // 4. Mark Messages Read Event
  socket.on('mark_read', async ({ partnerId }) => {
    try {
      if (!userId || !partnerId) return;

      await Message.updateMany(
        { sender: partnerId, receiver: userId, read: false },
        { $set: { read: true, status: 'READ', readAt: new Date() } }
      );

      const roomId = getConversationRoomId(userId, partnerId);
      io.to(roomId).emit('messages_read', { readerId: userId, partnerId });
      io.to(`user_${partnerId}`).emit('messages_read', { readerId: userId, partnerId });
    } catch (err) {
      console.error('[Socket] Error in mark_read:', err);
    }
  });

  // 5. Real-Time Typing Status Events
  socket.on('typing_start', ({ partnerId }) => {
    if (!userId || !partnerId) return;
    const roomId = getConversationRoomId(userId, partnerId);
    socket.to(roomId).emit('user_typing_start', { userId: userId.toString(), partnerId });
    io.to(`user_${partnerId}`).emit('user_typing_start', { userId: userId.toString(), partnerId });
  });

  socket.on('typing_stop', ({ partnerId }) => {
    if (!userId || !partnerId) return;
    const roomId = getConversationRoomId(userId, partnerId);
    socket.to(roomId).emit('user_typing_stop', { userId: userId.toString(), partnerId });
    io.to(`user_${partnerId}`).emit('user_typing_stop', { userId: userId.toString(), partnerId });
  });

  // 6. Check Online Status Request
  socket.on('check_online', ({ partnerId }, callback) => {
    if (typeof callback === 'function') {
      callback({ isOnline: onlineUsers.has(partnerId?.toString()) });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id} (User: ${userId})`);
    if (userId) {
      onlineUsers.delete(userId.toString());
      io.emit('user_offline', { userId: userId.toString() });
    }
  });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 [CityMate Server] Running on http://localhost:${PORT}`);
  });
});
