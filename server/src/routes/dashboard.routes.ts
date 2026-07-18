import { Router } from "express";
import * as ctrl from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, ctrl.getDashboard);

export default router;
