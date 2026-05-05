import { Router } from "express";
import { authController } from "../../../controllers/v1/auth/auth.controller";
import { authenticate } from "../../../middlewares/passport.config";
import { validate } from "../../../middlewares/validate";
import { loginSchema, registerSchema } from "../../../validations/v1/auth/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// Protected route example:
// router.get("/me", authenticate, authController.getMe);

export default router;
