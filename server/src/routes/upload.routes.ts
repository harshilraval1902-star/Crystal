import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", authenticate, upload.single("image"), uploadFile);

export default router;
