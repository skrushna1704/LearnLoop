import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
dotenv.config();

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['http://localhost:3000', 'http://localhost:3001']
      : '*', // Allow all origins in development
    methods: ['GET', 'POST']
  }
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001']
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

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinRoom', (exchangeId) => {
    // Leave all previous rooms first
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
        console.log(`User ${socket.id} left room ${room}`);
      }
    });
    
    socket.join(exchangeId);
    console.log(`User ${socket.id} joined room ${exchangeId}`);
  });

  socket.on('leaveRoom', (exchangeId) => {
    socket.leave(exchangeId);
    console.log(`User ${socket.id} left room ${exchangeId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
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