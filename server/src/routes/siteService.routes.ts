import { Router } from "express";
import * as ctrl from "../controllers/siteService.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation.middleware";
import { siteServiceCreateSchema, siteServiceUpdateSchema } from "../validators";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, validateBody(siteServiceCreateSchema), ctrl.create);
router.put("/:id", authenticate, validateBody(siteServiceUpdateSchema), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
