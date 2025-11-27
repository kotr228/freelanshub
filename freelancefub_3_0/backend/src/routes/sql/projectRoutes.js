import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getMyClientProjects,
  getMyFreelancerProjects,
  updateProjectStatus
} from '../../controllers/sql/projectController.js';
import { protect, authorize } from '../../middleware/sql/auth.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, authorize('client'), createProject);

router.get('/my/client', protect, authorize('client'), getMyClientProjects);
router.get('/my/freelancer', protect, authorize('freelancer'), getMyFreelancerProjects);

router.route('/:id')
  .get(getProject)
  .put(protect, authorize('client'), updateProject)
  .delete(protect, authorize('client'), deleteProject);

router.put('/:id/status', protect, updateProjectStatus);

export default router;
