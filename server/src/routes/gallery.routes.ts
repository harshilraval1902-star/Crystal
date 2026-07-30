import { Router } from "express";
import * as ctrl from "../controllers/gallery.controller";
import { authenticate } from "../middleware/auth";
import { upload, optimizeImage } from "../middleware/upload";
import { validateBody } from "../middleware/validation.middleware";
import { galleryCreateSchema, galleryUpdateSchema } from "../validators";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, upload.single("image"), optimizeImage, validateBody(galleryCreateSchema), ctrl.create);
router.put("/:id", authenticate, upload.single("image"), optimizeImage, validateBody(galleryUpdateSchema), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
