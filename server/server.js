import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import contestRoutes from './routes/contestRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { ensureLeetSeedData } from './utils/seedLeetData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools (curl/postman).
    if (!origin) {
      callback(null, true);
      return;
    }

    // Allow explicitly configured origins.
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    // In development, allow localhost/127.0.0.1 with any port
    // (useful when Vite auto-switches from 5173 to another port).
    if (
      process.env.NODE_ENV !== 'production' &&
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'MERN Major API is running',
    docs: {
      health: '/api/health',
      auth: '/api/auth',
      projects: '/api/projects',
      interviews: '/api/interviews',
      problems: '/api/problems',
      submissions: '/api/submissions',
      contests: '/api/contests',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/contests', contestRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const listenOnPort = (port) =>
  new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off('listening', onListening);
      reject(error);
    };

    const onListening = () => {
      server.off('error', onError);
      resolve();
    };

    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port);
  });

const startServer = async () => {
  try {
    await connectDB();
    await ensureLeetSeedData();

    await listenOnPort(PORT);
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    if (error?.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Another server instance is likely running. ` +
          'Stop the existing process or change PORT in server/.env.'
      );
      process.exit(0);
    }

    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

/**
 * Socket.IO events for interview room collaboration:
 * - WebRTC signaling (offer/answer/ice-candidate)
 * - Live coding sync (editor:update)
 * - In-room chat (chat:message)
 */
io.on('connection', (socket) => {
  socket.on('room:join', ({ roomId, user }) => {
    socket.join(roomId);
    socket.to(roomId).emit('room:user-joined', {
      socketId: socket.id,
      user,
    });
  });

  socket.on('webrtc:offer', ({ roomId, offer, fromUser }) => {
    socket.to(roomId).emit('webrtc:offer', {
      offer,
      senderSocketId: socket.id,
      fromUser,
    });
  });

  socket.on('webrtc:answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('webrtc:answer', {
      answer,
      senderSocketId: socket.id,
    });
  });

  socket.on('webrtc:ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('webrtc:ice-candidate', {
      candidate,
      senderSocketId: socket.id,
    });
  });

  socket.on('editor:update', ({ roomId, code, language }) => {
    socket.to(roomId).emit('editor:update', { code, language });
  });

  socket.on('chat:message', ({ roomId, message, user }) => {
    socket.to(roomId).emit('chat:message', {
      message,
      user,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('room:user-left', { socketId: socket.id });
  });
});
