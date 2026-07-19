import { Router } from "express";
import * as users from "../controllers/users.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// Ensure all /users routes are authenticated and restricted to Super Admins
router.use(authenticate as any, requireRole("Super Admin") as any);

router.get("/", users.getAllUsers);
router.post("/", users.createUser);
router.put("/:id", users.updateUser);
router.delete("/:id", users.deleteUser);

export default router;
