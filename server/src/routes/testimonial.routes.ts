import { Router } from "express";
import * as ctrl from "../controllers/testimonial.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation.middleware";
import { testimonialCreateSchema, testimonialUpdateSchema } from "../validators";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, validateBody(testimonialCreateSchema), ctrl.create);
router.put("/:id", authenticate, validateBody(testimonialUpdateSchema), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
