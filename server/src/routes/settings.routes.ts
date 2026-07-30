import { Router } from "express";
import * as ctrl from "../controllers/settings.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation.middleware";
import { siteSettingsUpdateSchema } from "../validators";

const router = Router();

router.get("/", ctrl.getAll);
router.post("/", authenticate, validateBody(siteSettingsUpdateSchema), ctrl.create);
router.put("/", authenticate, validateBody(siteSettingsUpdateSchema), ctrl.update);

export default router;
