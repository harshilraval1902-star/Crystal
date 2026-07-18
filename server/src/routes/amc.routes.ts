import { Router } from "express";
import * as ctrl from "../controllers/amc.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, ctrl.create);
router.put("/:id", authenticate, ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
