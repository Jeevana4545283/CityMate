import axios from 'axios';
import {
  MOCK_USERS,
  MOCK_PROPERTIES,
  MOCK_SERVICE_PROVIDERS,
  MOCK_BOOKINGS,
  MOCK_GAMES,
  MOCK_COMMUNITIES,
  MOCK_POSTS,
  MOCK_MARKETPLACE
} from './mockData';
import {
  IUser,
  IProperty,
  IServiceProvider,
  IServiceBooking,
  IGame,
  ICommunity,
  IPost,
  IMarketplaceItem,
  IConnection,
  IConversation,
  IMessage,
  INotification
} from '../types';

const API_BASE = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('citymate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Memory Storage Fallbacks
let memoryUsers = [...MOCK_USERS];
let memoryProperties = [...MOCK_PROPERTIES];
let memoryProviders = [...MOCK_SERVICE_PROVIDERS];
let memoryBookings = [...MOCK_BOOKINGS];
let memoryGames = [...MOCK_GAMES];
let memoryCommunities = [...MOCK_COMMUNITIES];
let memoryPosts = [...MOCK_POSTS];
let memoryMarketplace = [...MOCK_MARKETPLACE];
let memoryCurrentUser: IUser | null = null;

let memoryConnections: IConnection[] = [];
let memoryMessages: IMessage[] = [];
let memoryNotifications: INotification[] = [];

export const api = {
  // Auth (Passwordless)
  register: async (data: any) => {
    try {
      const res = await client.post('/auth/register', data);
      if (res.data?.token) {
        localStorage.setItem('citymate_token', res.data.token);
      }
      memoryCurrentUser = res.data.user;
      return res.data;
    } catch (e) {
      const normalizedEmail = (data.email || '').toLowerCase().trim();
      let found = memoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!found) {
        found = {
          _id: 'usr_' + Date.now(),
          name: data.name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          city: data.city || 'Hyderabad',
          area: data.area || 'Gachibowli',
          role: data.role || 'USER',
          interests: data.interests || ['Badminton', 'Tech'],
          sports: data.sports || [{ sport: 'Badminton', skillLevel: 'Intermediate', playingStyle: 'Doubles', preferredTime: 'Evening', availableDays: ['Saturday'] }],
          profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          age: 23,
          gender: 'Male'
        };
        memoryUsers.push(found);
      }
      memoryCurrentUser = found;
      const fakeToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('citymate_token', fakeToken);
      return { token: fakeToken, user: found };
    }
  },

  login: async (name: string, email: string) => {
    try {
      const res = await client.post('/auth/login', { name, email });
      if (res.data?.token) {
        localStorage.setItem('citymate_token', res.data.token);
      }
      memoryCurrentUser = res.data.user;
      return res.data;
    } catch (e) {
      const normalizedEmail = email.toLowerCase().trim();
      let found = memoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!found) {
        found = {
          _id: 'usr_' + Date.now(),
          name: name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          city: 'Hyderabad',
          area: 'Gachibowli',
          role: 'USER',
          interests: ['Badminton', 'Tech'],
          sports: [{ sport: 'Badminton', skillLevel: 'Intermediate', playingStyle: 'Doubles', preferredTime: 'Evening', availableDays: ['Saturday'] }],
          profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          age: 24,
          gender: 'Male'
        };
        memoryUsers.push(found);
      } else if (name && name.trim()) {
        found.name = name.trim();
      }
      memoryCurrentUser = found;
      const fakeToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('citymate_token', fakeToken);
      return { token: fakeToken, user: found };
    }
  },

  getMe: async () => {
    const token = localStorage.getItem('citymate_token');
    if (!token) {
      memoryCurrentUser = null;
      throw new Error('No authentication token');
    }
    try {
      const res = await client.get('/auth/me');
      memoryCurrentUser = res.data;
      return res.data;
    } catch (e) {
      if (memoryCurrentUser) return memoryCurrentUser;
      throw new Error('Unauthorized session');
    }
  },

  // Users & Roommates
  getUsers: async (filters?: any) => {
    try {
      const res = await client.get('/users', { params: filters });
      return res.data;
    } catch (e) {
      return memoryUsers;
    }
  },

  getNearbyUsers: async (city?: string, area?: string, sport?: string) => {
    try {
      const res = await client.get('/users/nearby', { params: { city, area, sport } });
      return res.data;
    } catch (e) {
      return memoryUsers.filter(u => u._id !== memoryCurrentUser?._id);
    }
  },

  updateProfile: async (data: Partial<IUser>) => {
    try {
      const res = await client.put(`/users/${memoryCurrentUser?._id || 'usr_001'}`, data);
      return res.data;
    } catch (e) {
      if (memoryCurrentUser) {
        Object.assign(memoryCurrentUser, data);
      }
      return memoryCurrentUser;
    }
  },

  // CONNECTIONS API
  sendConnectionRequest: async (receiverId: string) => {
    try {
      const res = await client.post('/connections/request', { receiverId });
      return res.data;
    } catch (e: any) {
      const currentId = memoryCurrentUser?._id || 'usr_001';
      let existing = memoryConnections.find(
        c => (c.sender === currentId && c.receiver === receiverId) || (c.sender === receiverId && c.receiver === currentId)
      );
      if (existing) {
        existing.sender = currentId;
        existing.receiver = receiverId;
        existing.status = 'Pending';
      } else {
        existing = {
          _id: 'conn_' + Date.now(),
          sender: currentId,
          receiver: receiverId,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        memoryConnections.push(existing);
      }
      return { message: 'Connection request sent', connection: existing };
    }
  },

  respondConnection: async (connectionId: string, action: 'Accept' | 'Reject') => {
    try {
      const res = await client.post('/connections/respond', { connectionId, action });
      return res.data;
    } catch (e: any) {
      const conn = memoryConnections.find(c => c._id === connectionId);
      if (conn) {
        conn.status = action === 'Accept' ? 'Accepted' : 'Rejected';
      }
      return { message: `Connection ${action.toLowerCase()}ed`, connection: conn };
    }
  },

  getConnectionStatus: async (targetUserId: string) => {
    try {
      const res = await client.get(`/connections/status/${targetUserId}`);
      return res.data;
    } catch (e) {
      const currentId = memoryCurrentUser?._id || 'usr_001';
      const conn = memoryConnections.find(
        c => (c.sender === currentId && c.receiver === targetUserId) || (c.sender === targetUserId && c.receiver === currentId)
      );
      if (!conn) return { status: 'None', connectionId: null };
      if (conn.status === 'Accepted') return { status: 'Accepted', connectionId: conn._id };
      if (conn.status === 'Pending') {
        const isSent = conn.sender === currentId;
        return { status: isSent ? 'Pending_Sent' : 'Pending_Received', connectionId: conn._id };
      }
      return { status: conn.status, connectionId: conn._id };
    }
  },

  getPendingRequests: async () => {
    try {
      const res = await client.get('/connections/pending');
      return res.data;
    } catch (e) {
      const currentId = memoryCurrentUser?._id || 'usr_001';
      return memoryConnections.filter(c => c.receiver === currentId && c.status === 'Pending');
    }
  },

  getConnections: async () => {
    try {
      const res = await client.get('/connections');
      return res.data;
    } catch (e) {
      const currentId = memoryCurrentUser?._id || 'usr_001';
      return memoryConnections.filter(
        c => (c.sender === currentId || c.receiver === currentId) && c.status === 'Accepted'
      );
    }
  },

  // CHAT & MESSAGING API
  getConversations: async () => {
    try {
      const res = await client.get('/chat/conversations');
      return res.data;
    } catch (e) {
      const currentId = memoryCurrentUser?._id || 'usr_001';
      const acceptedConns = memoryConnections.filter(
        c => (c.sender === currentId || c.receiver === currentId) && c.status === 'Accepted'
      );

      const convs: IConversation[] = acceptedConns.map(conn => {
        const partnerId = conn.sender === currentId ? conn.receiver : conn.sender;
        const partner = memoryUsers.find(u => u._id === (typeof partnerId === 'string' ? partnerId : (partnerId as any)._id)) || memoryUsers[1];

        const userMsgs = memoryMessages.filter(
          m => (m.sender === currentId && m.receiver === partner._id) || (m.sender === partner._id && m.receiver === currentId)
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const lastMsg = userMsgs[0];
        const unreadCount = memoryMessages.filter(m => m.sender === partner._id && m.receiver === currentId && !m.read).length;

        return {
          partner,
          connectionId: conn._id,
          lastMessage: lastMsg ? lastMsg.content : 'Connection accepted! Start a conversation.',
          lastMessageTime: lastMsg ? lastMsg.createdAt : conn.updatedAt,
          unreadCount
        };
      });

      return convs;
    }
  },

  getMessages: async (otherUserId: string) => {
    try {
      const res = await client.get(`/chat/${otherUserId}`);
      return res.data;
    } catch (e: any) {
      const currentId = memoryCurrentUser?._id || 'usr_001';
      const conn = memoryConnections.find(
        c => (c.sender === currentId && c.receiver === otherUserId) || (c.sender === otherUserId && c.receiver === currentId)
      );

      if (!conn || conn.status !== 'Accepted') {
        throw new Error('Chat access allowed only for connected users with an accepted request.');
      }

      const msgs = memoryMessages.filter(
        m => (m.sender === currentId && m.receiver === otherUserId) || (m.sender === otherUserId && m.receiver === currentId)
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      msgs.forEach(m => {
        if (m.sender === otherUserId && m.receiver === currentId) {
          m.read = true;
        }
      });

      return msgs;
    }
  },

  sendMessage: async (receiverId: string, content: string) => {
    try {
      const res = await client.post('/chat', { receiverId, content });
      return res.data;
    } catch (e: any) {
      const currentId = memoryCurrentUser?._id || 'usr_001';
      const conn = memoryConnections.find(
        c => (c.sender === currentId && c.receiver === receiverId) || (c.sender === receiverId && c.receiver === currentId)
      );

      if (!conn || conn.status !== 'Accepted') {
        throw new Error('Cannot send message. Connection request must be accepted first.');
      }

      const newMsg: IMessage = {
        _id: 'msg_' + Date.now(),
        sender: currentId,
        receiver: receiverId,
        content,
        read: false,
        createdAt: new Date().toISOString()
      };
      memoryMessages.push(newMsg);
      return newMsg;
    }
  },

  // NOTIFICATIONS API
  getNotifications: async () => {
    try {
      const res = await client.get('/notifications');
      return res.data;
    } catch (e) {
      return memoryNotifications;
    }
  },

  getUnreadNotificationCount: async () => {
    try {
      const res = await client.get('/notifications/unread-count');
      return res.data.unreadCount;
    } catch (e) {
      return memoryNotifications.filter(n => !n.read).length;
    }
  },

  markNotificationRead: async (id: string) => {
    try {
      const res = await client.put(`/notifications/${id}/read`);
      return res.data;
    } catch (e) {
      const item = memoryNotifications.find(n => n._id === id);
      if (item) item.read = true;
      return item;
    }
  },

  markAllNotificationsRead: async () => {
    try {
      const res = await client.put('/notifications/mark-all-read');
      return res.data;
    } catch (e) {
      memoryNotifications.forEach(n => (n.read = true));
      return { message: 'All notifications marked as read' };
    }
  },

  // Properties
  getProperties: async (filters?: any) => {
    try {
      const res = await client.get('/properties', { params: filters });
      return res.data;
    } catch (e) {
      let list = memoryProperties;
      if (filters?.type && filters.type !== 'All') {
        list = list.filter(p => p.type === filters.type);
      }
      if (filters?.maxRent) {
        list = list.filter(p => p.rent <= Number(filters.maxRent));
      }
      return list;
    }
  },

  getPropertyById: async (id: string) => {
    try {
      const res = await client.get(`/properties/${id}`);
      return res.data;
    } catch (e) {
      return memoryProperties.find(p => p._id === id) || memoryProperties[0];
    }
  },

  getMyListings: async () => {
    const res = await client.get('/properties/my-listings');
    return res.data;
  },

  createProperty: async (propertyData: any) => {
    const res = await client.post('/properties', propertyData);
    return res.data;
  },

  updateProperty: async (id: string, propertyData: any) => {
    const res = await client.put(`/properties/${id}`, propertyData);
    return res.data;
  },

  deleteProperty: async (id: string) => {
    const res = await client.delete(`/properties/${id}`);
    return res.data;
  },

  // Property Bookings
  createPropertyBooking: async (data: { propertyId: string; moveInDate?: string; rentAgreed?: number; depositAgreed?: number }) => {
    const res = await client.post('/bookings', data);
    return res.data;
  },

  getMyBookings: async () => {
    const res = await client.get('/bookings/my-bookings');
    return res.data;
  },

  getBookingRequests: async () => {
    const res = await client.get('/bookings/requests');
    return res.data;
  },

  // Roommates API
  getRoommateProfile: async () => {
    const res = await client.get('/roommates/profile');
    return res.data;
  },

  saveRoommateProfile: async (data: any) => {
    const res = await client.post('/roommates/profile', data);
    return res.data;
  },

  discoverRoommates: async () => {
    const res = await client.get('/roommates/discover');
    return res.data;
  },

  expressInterest: async (data: { toProfileId: string }) => {
    const res = await client.post('/roommates/interest', data);
    return res.data;
  },

  getMatches: async () => {
    const res = await client.get('/roommates/matches');
    return res.data;
  },

  reportOrBlockRoommate: async (data: { reportedUser: string; type: 'REPORT' | 'BLOCK' }) => {
    const res = await client.post('/roommates/report-block', data);
    return res.data;
  },

  acceptBooking: async (id: string) => {
    const res = await client.put(`/bookings/${id}/accept`);
    return res.data;
  },

  rejectBooking: async (id: string) => {
    const res = await client.put(`/bookings/${id}/reject`);
    return res.data;
  },

  cancelBooking: async (id: string) => {
    const res = await client.delete(`/bookings/${id}/cancel`);
    return res.data;
  },

  // Services & Handymen
  getServiceProviders: async (category?: string, city?: string) => {
    try {
      const res = await client.get('/services/providers', { params: { category, city } });
      return res.data;
    } catch (e) {
      if (category && category !== 'All') {
        return memoryProviders.filter(p => p.category === category);
      }
      return memoryProviders;
    }
  },

  createBooking: async (bookingData: any) => {
    try {
      const res = await client.post('/services/bookings', bookingData);
      return res.data;
    } catch (e) {
      const targetProv = memoryProviders.find(p => p._id === bookingData.providerId) || memoryProviders[0];
      const newBooking: IServiceBooking = {
        _id: 'book_' + Date.now(),
        user: memoryCurrentUser || ({} as any),
        provider: targetProv,
        serviceCategory: bookingData.serviceCategory || 'Fan Repair',
        problemDescription: bookingData.problemDescription,
        bookingDate: bookingData.bookingDate,
        bookingTimeSlot: bookingData.bookingTimeSlot,
        locationAddress: bookingData.locationAddress,
        area: bookingData.area || 'Gachibowli',
        city: bookingData.city || 'Hyderabad',
        status: 'Requested',
        estimatedCost: bookingData.estimatedCost || 349,
        workerName: targetProv.businessName,
        createdAt: new Date().toISOString()
      };
      memoryBookings.unshift(newBooking);
      return newBooking;
    }
  },

  getBookings: async () => {
    try {
      const res = await client.get('/services/bookings');
      return res.data;
    } catch (e) {
      return memoryBookings;
    }
  },

  updateBookingStatus: async (bookingId: string, status: string, workerName?: string, workerPhone?: string) => {
    try {
      const res = await client.put(`/services/bookings/${bookingId}/status`, { status, workerName, workerPhone });
      return res.data;
    } catch (e) {
      const item = memoryBookings.find(b => b._id === bookingId);
      if (item) {
        item.status = status as any;
        if (workerName) item.workerName = workerName;
        if (workerPhone) item.workerPhone = workerPhone;
      }
      return item;
    }
  },

  updateProviderStatus: async (status: 'Available' | 'Busy' | 'Offline') => {
    try {
      const res = await client.put('/services/providers/status', { availabilityStatus: status });
      return res.data;
    } catch (e) {
      if (memoryProviders.length > 0) {
        memoryProviders[0].availabilityStatus = status;
      }
      return memoryProviders[0];
    }
  },

  // Sports & Games
  getGames: async (sport?: string, city?: string, area?: string) => {
    try {
      const res = await client.get('/sports/games', { params: { sport, city, area } });
      return res.data;
    } catch (e) {
      if (sport && sport !== 'All') {
        return memoryGames.filter(g => g.sport.toLowerCase() === sport.toLowerCase());
      }
      return memoryGames;
    }
  },

  createGame: async (gameData: any) => {
    try {
      const res = await client.post('/sports/games', gameData);
      return res.data;
    } catch (e) {
      const newGame: IGame = {
        _id: 'game_' + Date.now(),
        host: memoryCurrentUser || ({} as any),
        sport: gameData.sport,
        title: gameData.title,
        date: gameData.date,
        time: gameData.time,
        venue: gameData.venue,
        city: gameData.city || 'Hyderabad',
        area: gameData.area || 'Gachibowli',
        skillLevel: gameData.skillLevel || 'Intermediate',
        playingStyle: gameData.playingStyle || 'Doubles',
        maxPlayers: Number(gameData.maxPlayers) || 4,
        playersJoined: memoryCurrentUser ? [memoryCurrentUser] : [],
        description: gameData.description || ''
      };
      memoryGames.unshift(newGame);
      return newGame;
    }
  },

  joinGame: async (gameId: string) => {
    try {
      const res = await client.post(`/sports/games/${gameId}/join`);
      return res.data;
    } catch (e) {
      const game = memoryGames.find(g => g._id === gameId);
      if (game && memoryCurrentUser) {
        const exists = game.playersJoined.some((p: any) => (p._id || p) === memoryCurrentUser?._id);
        if (!exists) {
          game.playersJoined.push(memoryCurrentUser);
        }
      }
      return game;
    }
  },

  // Sports Requests
  sendSportsRequest: async (postId: string) => {
    const res = await client.post('/sports-partner-requests', { postId });
    return res.data;
  },
  getMySportsRequests: async () => {
    const res = await client.get('/sports-partner-requests/my-requests');
    return res.data;
  },
  getReceivedSportsRequests: async () => {
    const res = await client.get('/sports-partner-requests/received');
    return res.data;
  },
  acceptSportsRequest: async (id: string) => {
    const res = await client.put(`/sports-partner-requests/${id}/accept`);
    return res.data;
  },
  rejectSportsRequest: async (id: string) => {
    const res = await client.put(`/sports-partner-requests/${id}/reject`);
    return res.data;
  },
  cancelSportsRequest: async (id: string) => {
    const res = await client.delete(`/sports-partner-requests/${id}/cancel`);
    return res.data;
  },
  getMySportsPosts: async () => {
    const res = await client.get('/sports-partner-requests/my-posts');
    return res.data;
  },
  deleteSportsPost: async (id: string) => {
    const res = await client.delete(`/sports-partner-requests/posts/${id}`);
    return res.data;
  },

  // Communities & Posts
  getCommunities: async () => {
    try {
      const res = await client.get('/community/communities');
      return res.data;
    } catch (e) {
      return memoryCommunities;
    }
  },

  joinCommunity: async (communityId: string) => {
    try {
      const res = await client.post(`/community/communities/${communityId}/join`);
      return res.data;
    } catch (e) {
      const comm = memoryCommunities.find(c => c._id === communityId);
      if (comm && memoryCurrentUser) {
        const exists = comm.members.some((m: any) => (m._id || m) === memoryCurrentUser?._id);
        if (!exists) {
          comm.members.push(memoryCurrentUser);
        }
      }
      return comm;
    }
  },

  getPosts: async (type?: string) => {
    try {
      const res = await client.get('/community/posts', { params: { type } });
      return res.data;
    } catch (e) {
      if (type) {
        return memoryPosts.filter(p => p.type === type);
      }
      return memoryPosts;
    }
  },

  createPost: async (postData: any) => {
    try {
      const res = await client.post('/community/posts', postData);
      return res.data;
    } catch (e) {
      const newPost: IPost = {
        _id: 'post_' + Date.now(),
        author: memoryCurrentUser || ({} as any),
        type: postData.type || 'Discussion',
        title: postData.title || '',
        content: postData.content,
        city: postData.city || 'Hyderabad',
        area: postData.area || 'Gachibowli',
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      memoryPosts.unshift(newPost);
      return newPost;
    }
  },

  addComment: async (postId: string, content: string) => {
    try {
      const res = await client.post(`/community/posts/${postId}/comments`, { content });
      return res.data;
    } catch (e) {
      const post = memoryPosts.find(p => p._id === postId);
      if (post) {
        post.comments.push({
          _id: 'cmt_' + Date.now(),
          author: memoryCurrentUser || ({} as any),
          authorName: memoryCurrentUser?.name || 'User',
          authorPhoto: memoryCurrentUser?.profilePhoto || '',
          content,
          createdAt: new Date().toISOString()
        });
      }
      return post;
    }
  },

  // Marketplace & Essentials
  getMarketplaceItems: async () => {
    try {
      const res = await client.get('/marketplace');
      return res.data;
    } catch (e) {
      return memoryMarketplace;
    }
  },

  createMarketplaceItem: async (itemData: any) => {
    try {
      const res = await client.post('/marketplace', itemData);
      return res.data;
    } catch (e) {
      const newItem: IMarketplaceItem = {
        _id: 'mkt_' + Date.now(),
        seller: memoryCurrentUser || ({} as any),
        title: itemData.title,
        description: itemData.description,
        price: Number(itemData.price),
        category: itemData.category || 'Furniture',
        images: itemData.images || ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800'],
        city: itemData.city || 'Hyderabad',
        area: itemData.area || 'Gachibowli',
        status: 'Available',
        distance: 1.5
      };
      memoryMarketplace.unshift(newItem);
      return newItem;
    }
  },
  // Events
  getEvents: async (category?: string, city?: string, search?: string) => {
    const res = await client.get('/events', { params: { category, city, search } });
    return res.data;
  },
  getEventById: async (id: string) => {
    const res = await client.get(`/events/${id}`);
    return res.data;
  },
  getMyEvents: async () => {
    const res = await client.get('/events/my-events');
    return res.data;
  },
  getJoinedEvents: async () => {
    const res = await client.get('/events/joined');
    return res.data;
  },
  createEvent: async (data: any) => {
    const res = await client.post('/events', data);
    return res.data;
  },
  updateEvent: async (id: string, data: any) => {
    const res = await client.put(`/events/${id}`, data);
    return res.data;
  },
  deleteEvent: async (id: string) => {
    const res = await client.delete(`/events/${id}`);
    return res.data;
  },
  joinEvent: async (id: string) => {
    const res = await client.post(`/events/${id}/join`);
    return res.data;
  },
  leaveEvent: async (id: string) => {
    const res = await client.delete(`/events/${id}/leave`);
    return res.data;
  },
  getAvailableEventPartners: async (id: string) => {
    const res = await client.get(`/events/${id}/available-partners`);
    return res.data;
  },
  sendEventPartnerRequest: async (id: string, targetUserId: string) => {
    const res = await client.post(`/events/${id}/partner-requests`, { targetUserId });
    return res.data;
  },
  getEventPartnerRequests: async () => {
    const res = await client.get('/events/partner-requests/me');
    return res.data;
  },
  acceptEventPartnerRequest: async (id: string) => {
    const res = await client.post(`/events/partner-requests/${id}/accept`);
    return res.data;
  },
  rejectEventPartnerRequest: async (id: string) => {
    const res = await client.post(`/events/partner-requests/${id}/reject`);
    return res.data;
  },

  // Admin
  getAdminStats: async () => {
    try {
      const res = await client.get('/admin/stats');
      return res.data;
    } catch (e) {
      return {
        totalUsers: memoryUsers.length + 152,
        serviceProviders: memoryProviders.length + 24,
        totalProperties: memoryProperties.length + 42,
        totalBookings: memoryBookings.length + 189,
        totalGames: memoryGames.length + 67,
        totalCommunities: memoryCommunities.length + 14,
        pendingVerifications: 3,
        activeUsers: 142
      };
    }
  }
};
