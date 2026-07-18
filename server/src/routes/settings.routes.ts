import { Router } from "express";
import * as ctrl from "../controllers/settings.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", ctrl.getAll);
router.post("/", authenticate, ctrl.create);
router.put("/", authenticate, ctrl.update);

export default router;
