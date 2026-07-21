import { Router } from 'express';
import { HeroSlideController } from '../controllers/heroSlide.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public route
router.get('/', HeroSlideController.getAllActive);

// Admin routes
router.get('/admin', authenticate, HeroSlideController.getAllAdmin);
router.post('/', authenticate, HeroSlideController.create);
router.put('/:id', authenticate, HeroSlideController.update);
router.delete('/:id', authenticate, HeroSlideController.delete);

export default router;
