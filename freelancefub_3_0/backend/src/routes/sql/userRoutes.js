import express from 'express';
import { getUserProfile, updateProfile, getFreelancers } from '../../controllers/sql/userController.js';
import { protect } from '../../middleware/sql/auth.js';

const router = express.Router();

// Публічні роути
router.get('/freelancers', getFreelancers);
router.get('/:id', getUserProfile);

// Захищені роути
router.put('/profile', protect, updateProfile);

export default router;
