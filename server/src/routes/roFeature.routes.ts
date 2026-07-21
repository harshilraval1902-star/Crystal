import { Router } from 'express';
import { ROFeatureController } from '../controllers/roFeature.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public route
router.get('/', ROFeatureController.getAllActive);

// Admin routes
router.get('/admin', authenticate, ROFeatureController.getAllAdmin);
router.post('/', authenticate, ROFeatureController.create);
router.put('/:id', authenticate, ROFeatureController.update);
router.delete('/:id', authenticate, ROFeatureController.delete);

export default router;
