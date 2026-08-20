import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import propertyRoutes from './routes/propertyRoutes';
import serviceRoutes from './routes/serviceRoutes';
import sportsRoutes from './routes/sportsRoutes';
import communityRoutes from './routes/communityRoutes';
import chatRoutes from './routes/chatRoutes';
import adminRoutes from './routes/adminRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import connectionRoutes from './routes/connectionRoutes';
import notificationRoutes from './routes/notificationRoutes';
import bookingRoutes from './routes/bookingRoutes';
import sportsRequestRoutes from './routes/sportsRequestRoutes';
import eventRoutes from './routes/eventRoutes';
import roommateRoutes from './routes/roommateRoutes';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'CityMate API', version: '1.0.0', time: new Date() });
});

// Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sports-partner-requests', sportsRequestRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/roommates', roommateRoutes);

export default app;
