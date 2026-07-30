import { Router } from "express";
import * as ctrl from "../controllers/faq.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation.middleware";
import { faqCreateSchema, faqUpdateSchema } from "../validators";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, validateBody(faqCreateSchema), ctrl.create);
router.put("/:id", authenticate, validateBody(faqUpdateSchema), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
