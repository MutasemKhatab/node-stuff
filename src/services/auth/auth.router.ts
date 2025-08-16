import { Router } from "express";
import { validate } from "../middleware/auth.middleware.ts";
import * as authController from "./auth.controller.ts";
import { loginSchema } from "./auth.validators.ts";
const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/register", authController.register);

export default router;
