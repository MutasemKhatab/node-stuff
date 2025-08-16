import { Router } from "express";
import { validateSchema, verifyToken } from "../middleware/auth.middleware.ts";
import * as authController from "./auth.controller.ts";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "./auth.validators.ts";
const router = Router();

router.post("/login", validateSchema(loginSchema), authController.login);
router.post(
  "/register",
  validateSchema(registerSchema),
  authController.register
);

router.post(
  "/change-password",
  validateSchema(changePasswordSchema),
  verifyToken,
  authController.changePassword
);

export default router;
