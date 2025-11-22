import express from 'express';
import {
  getMessages,
  sendMessage,
  getUnreadMessages
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/unread', protect, getUnreadMessages);
router.get('/:projectId', protect, getMessages);
router.post('/', protect, sendMessage);

export default router;
