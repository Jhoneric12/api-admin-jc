import { Router } from "express";
import { authController } from "../../controllers/v1/auth.controller";
import { authenticate } from "../../middlewares/passport.config";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route example:
// router.get("/me", authenticate, authController.getMe);

export default router;
