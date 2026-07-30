import { Router } from "express";
import * as ctrl from "../controllers/amc.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation.middleware";
import { amcPlanCreateSchema, amcPlanUpdateSchema } from "../validators";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, validateBody(amcPlanCreateSchema), ctrl.create);
router.put("/:id", authenticate, validateBody(amcPlanUpdateSchema), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
