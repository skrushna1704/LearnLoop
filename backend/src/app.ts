import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import skillRoutes from './routes/skill';
import exchangeRoutes from './routes/exchangeRoutes';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';
import postRoutes from './routes/postRoutes';
import aiRoutes from './routes/aiRoutes';
import uploadRoutes from './routes/uploadRoutes';
import practiceRoutes from './routes/practiceRoutes';

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://www.learnloop.world",
      "https://learnloop.world",
      "https://api.learnloop.world"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://www.learnloop.world',
        'https://learnloop.world',
        'https://api.learnloop.world'
      ]
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables');
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/practice', practiceRoutes);

const onlineUsers: { [userId: string]: string } = {};

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    onlineUsers[userId] = socket.id;
    // Notify all clients this user is online
    io.emit('userOnline', { userId });
    // Send the current list of online users to the newly connected client
    socket.emit('onlineUsers', { userIds: Object.keys(onlineUsers) });
    socket.join(userId);
  }

  // Add missing joinRoom handler
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
    console.log(`Current rooms for socket ${socket.id}:`, Array.from(socket.rooms));
  });

  // Add test handler
  socket.on('test', (data) => {
    console.log(`Test message received from socket ${socket.id}:`, data);
    socket.emit('testResponse', { message: 'Test response from server', socketId: socket.id });
  });

  socket.on('joinMultipleRooms', (roomIds) => {
    if (Array.isArray(roomIds)) {
      roomIds.forEach(roomId => socket.join(roomId));
      console.log(`Socket ${socket.id} joined rooms:`, roomIds);
    }
  });

  socket.on('leaveMultipleRooms', (roomIds) => {
    if (Array.isArray(roomIds)) {
      roomIds.forEach(roomId => socket.leave(roomId));
      console.log(`Socket ${socket.id} left rooms:`, roomIds);
    }
  });

  socket.on('sendMessage', async ({ exchangeId, sender, content }) => {
    try {
      const message = {
        exchangeId,
        sender,
        content,
        timestamp: new Date()
      };
      // For now, just broadcast it to the exchange room
      socket.to(exchangeId).emit('newMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // --- WebRTC Signaling Events ---
  
  socket.on('join-call-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined call room ${roomId}`);
    socket.to(roomId).emit('user-joined', socket.id);
    
    const exchangeId = roomId.replace('call-', '');
    socket.to(exchangeId).emit('call-incoming', {
      exchangeId,
      callerId: socket.id,
      message: 'Someone wants to start a video call'
    });
  });

  // Add call-presence event for robust call handshake
  socket.on('call-presence', ({ roomId, userId }) => {
    console.log(`call-presence from user ${userId} (socket ${socket.id}) in room ${roomId}`);
    socket.to(roomId).emit('call-presence', { userId, socketId: socket.id });
  });

  socket.on('webrtc-offer', ({ sdp, offererId, roomId }) => {
    socket.to(roomId).emit('webrtc-offer', { sdp, offererId });
  });

  socket.on('webrtc-answer', ({ sdp, answererId, roomId }) => {
    socket.to(roomId).emit('webrtc-answer', { sdp, answererId });
  });

  socket.on('webrtc-ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('webrtc-ice-candidate', { candidate });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    if (userId) {
      delete onlineUsers[userId];
      // Notify all clients this user is offline
      io.emit('userOffline', { userId });
    }
  });
});

app.get('/', (req, res) => {
  res.send('ok');
});

// // 404 handler for undefined routes
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5050;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 