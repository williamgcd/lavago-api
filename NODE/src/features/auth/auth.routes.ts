import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post('/otp/send', authController.otpSend);
router.post('/otp/check', authController.otpCheck);

export { router as authRoutes };
export default router;