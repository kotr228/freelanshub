import express from 'express';
import {
  createBid,
  getProjectBids,
  getMyBids,
  acceptBid,
  rejectBid
} from '../controllers/bidController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('freelancer'), createBid);
router.get('/my', protect, authorize('freelancer'), getMyBids);
router.get('/project/:projectId', protect, authorize('client'), getProjectBids);
router.put('/:id/accept', protect, authorize('client'), acceptBid);
router.put('/:id/reject', protect, authorize('client'), rejectBid);

export default router;
