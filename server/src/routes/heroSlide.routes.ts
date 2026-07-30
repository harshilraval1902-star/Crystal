import { Router } from 'express';
import { HeroSlideController } from '../controllers/heroSlide.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from "../middleware/validation.middleware";
import { heroSlideCreateSchema, heroSlideUpdateSchema } from "../validators";

const router = Router();

// Public route
router.get('/', HeroSlideController.getAllActive);

// Admin routes
router.get('/admin', authenticate, HeroSlideController.getAllAdmin);
router.post('/', authenticate, validateBody(heroSlideCreateSchema), HeroSlideController.create);
router.put('/:id', authenticate, validateBody(heroSlideUpdateSchema), HeroSlideController.update);
router.delete('/:id', authenticate, HeroSlideController.delete);

export default router;
