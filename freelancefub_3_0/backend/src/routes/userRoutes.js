import express from 'express';
import { getUserProfile, updateProfile, getFreelancers } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/freelancers', getFreelancers);
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);

export default router;
