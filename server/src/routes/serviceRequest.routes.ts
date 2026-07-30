import { Router } from "express";
import * as ctrl from "../controllers/serviceRequest.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation.middleware";
import { bookingCreateSchema, bookingUpdateSchema } from "../validators";

const router = Router();

// Public — customers can submit
router.post("/", validateBody(bookingCreateSchema), ctrl.create);
// Protected — admin reads and manages
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validateBody(bookingUpdateSchema), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
