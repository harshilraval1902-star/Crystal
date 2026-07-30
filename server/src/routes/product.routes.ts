import { Router } from "express";
import * as ctrl from "../controllers/product.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validation.middleware";
import { productCreateSchema, productUpdateSchema } from "../validators";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, validateBody(productCreateSchema), ctrl.create);
router.put("/:id", authenticate, validateBody(productUpdateSchema), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;
