import express from 'express';
import {
  getMessages,
  sendMessage,
  getUnreadMessages,
  getConversations
} from '../../controllers/sql/messageController.js';
import { protect } from '../../middleware/sql/auth.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/unread', protect, getUnreadMessages);
router.get('/:projectId', protect, getMessages);
router.post('/', protect, sendMessage);

export default router;
