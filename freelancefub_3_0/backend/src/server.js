import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Models для Socket.io
import Message from './models/Message.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

// Завантаження змінних середовища
dotenv.config();

// Підключення до БД
connectDB();

// Ініціалізація Express
const app = express();
const httpServer = createServer(app);

// Socket.io налаштування
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логування запитів у dev режимі
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Головний route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FreelanceHub API v1.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      projects: '/api/projects',
      bids: '/api/bids',
      reviews: '/api/reviews',
      messages: '/api/messages'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// Error Handler (має бути останнім)
app.use(errorHandler);

// Socket.io Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.userName = user.name;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`✅ Користувач підключився: ${socket.userName} (${socket.userId})`);

  // Приєднання до кімнати проєкту
  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`📁 Користувач ${socket.userName} приєднався до проєкту ${projectId}`);
  });

  // Відправка повідомлення
  socket.on('send_message', async (data) => {
    try {
      const { projectId, receiverId, content } = data;

      // Створення повідомлення в БД
      const message = await Message.create({
        project: projectId,
        sender: socket.userId,
        receiver: receiverId,
        content
      });

      await message.populate('sender', 'name avatar');
      await message.populate('receiver', 'name avatar');

      // Відправка повідомлення у кімнату проєкту
      io.to(`project_${projectId}`).emit('new_message', message);

      console.log(`💬 Нове повідомлення у проєкті ${projectId}`);
    } catch (error) {
      console.error('Помилка відправки повідомлення:', error);
      socket.emit('message_error', { message: 'Помилка відправки повідомлення' });
    }
  });

  // Typing indicator
  socket.on('typing', ({ projectId, userName }) => {
    socket.to(`project_${projectId}`).emit('user_typing', { userName });
  });

  socket.on('stop_typing', ({ projectId }) => {
    socket.to(`project_${projectId}`).emit('user_stop_typing');
  });

  // Відключення
  socket.on('disconnect', () => {
    console.log(`❌ Користувач відключився: ${socket.userName}`);
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   🚀 FreelanceHub Server запущено             ║
║   📡 Порт: ${PORT}                              ║
║   🌍 Режим: ${process.env.NODE_ENV}            ║
║   💾 MongoDB підключено                        ║
╚═══════════════════════════════════════════════╝
  `);
});

// Обробка необроблених помилок
process.on('unhandledRejection', (err) => {
  console.error(`❌ Необроблена помилка: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export default app;
