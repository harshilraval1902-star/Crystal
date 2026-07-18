import { Router } from "express";
import * as ctrl from "../controllers/gallery.controller";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, upload.single("image"), ctrl.create);
router.put("/:id", authenticate, upload.single("image"), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
