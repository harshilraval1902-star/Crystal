import { Router } from "express";
import * as ctrl from "../controllers/subscriber.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation.middleware";
import { subscriberCreateSchema, subscriberBulkDeleteSchema } from "../validators";

const router = Router();

// Public — subscription form submission
router.post("/", validateBody(subscriberCreateSchema), ctrl.create);

// Protected — admin reads and deletes subscribers
router.get("/", authenticate, ctrl.getAll);
router.delete("/bulk", authenticate, validateBody(subscriberBulkDeleteSchema), ctrl.bulkDelete);
router.post("/export", authenticate, ctrl.exportSubscribers);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
