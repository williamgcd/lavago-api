import { Router } from 'express';
import { authController } from './controller';
import { handleLimiter } from '@/middlewares/handle-limiter';

const router = Router();

/**
 * Rate limiting middleware
 * Since the auth routes are public, we can use more strict limiter;
 * @see: src/middlewares/handle-limiter.ts
 */
router.use(handleLimiter('strict'));

router.use('/create', authController.create);

router.use('/otp/email', authController.otpEmail);
router.use('/otp/phone', authController.otpPhone);

export { router as authRouter };
