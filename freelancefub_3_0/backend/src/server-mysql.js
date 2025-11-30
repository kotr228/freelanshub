import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/mysql.js';
import errorHandler from './middleware/errorHandler.js';

// SQL Models
import { User, Message } from './models/sql/index.js';

// SQL Routes
import authRoutes from './routes/sql/authRoutes.js';
import projectRoutes from './routes/sql/projectRoutes.js';
import bidRoutes from './routes/sql/bidRoutes.js';
import messageRoutes from './routes/sql/messageRoutes.js';
import userRoutes from './routes/sql/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import jwt from 'jsonwebtoken';

// Завантаження змінних середовища
dotenv.config();

// Підключення до MySQL
await connectDB();

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
    message: 'FreelanceHub API v1.0 (MySQL)',
    database: 'MySQL',
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
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user.id;
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
        project_id: projectId,
        sender_id: socket.userId,
        receiver_id: receiverId,
        content
      });

      // Завантажуємо зв'язані дані
      const fullMessage = await Message.findByPk(message.id, {
        include: [
          { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
          { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] }
        ]
      });

      // Відправка повідомлення у кімнату проєкту
      io.to(`project_${projectId}`).emit('new_message', fullMessage);

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
║   🚀 FreelanceHub Server (MySQL)              ║
║   📡 Порт: ${PORT}                              ║
║   🌍 Режим: ${process.env.NODE_ENV}            ║
║   💾 MySQL підключено                          ║
╚═══════════════════════════════════════════════╝
  `);
});

// Обробка необроблених помилок
process.on('unhandledRejection', (err) => {
  console.error(`❌ Необроблена помилка: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export default app;
