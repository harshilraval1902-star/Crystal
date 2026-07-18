import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.post("/refresh", auth.refresh);
router.get("/me", authenticate, auth.me);

export default router;
