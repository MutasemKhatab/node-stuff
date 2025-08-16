import { Router } from "express";
import { validate } from "../middleware/auth.middleware.ts";
import * as authController from "./auth.controller.ts";
import { loginSchema, registerSchema } from "./auth.validators.ts";
const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);

export default router;
