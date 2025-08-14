import { Router } from 'express';

import { reqUserGuard } from '@/guards/req-user';

import { addressRouter } from '@/features/address/router';
import { auditRouter } from '@/features/audit/router';
import { authRouter } from '@/features/auth/router';
// import { bookingRouter } from '@/features/booking/router';
import { cacheRouter } from '@/features/cache/router';
import { chatRouter } from '@/features/chat/router';
// import { contextRouter } from '@/features/context/router';
import { couponRouter } from '@/features/coupon/router';
import { geofenceRouter } from '@/features/geofence/router';
// import { icsRouter } from '@/features/ics/router';
// import { llmRouter } from '@/features/llm/router';
import { offeringRouter } from '@/features/offering/router';
import { paymentRouter } from '@/features/payment/router';
import { planRouter } from '@/features/plan/router';
import { propertyRouter } from '@/features/property/router';
import { questionRouter } from '@/features/question/router';
import { ratingRouter } from '@/features/rating/router';
import { referralRouter } from '@/features/referral/router';
// import { scheduleRouter } from '@/features/schedule/router';
import { scheduleExceptionRouter } from '@/features/schedule-exception/router';
import { scheduleSlotRouter } from '@/features/schedule-slot/router';
import { subscriptionRouter } from '@/features/subscription/router';
// import { termRouter } from '@/features/term/router';
import { ticketRouter } from '@/features/ticket/router';
import { transactionRouter } from '@/features/transaction/router';
import { userRouter } from '@/features/user/router';
import { vehicleRouter } from '@/features/vehicle/router';
import { walletRouter } from '@/features/wallet/router';
import { washerRouter } from '@/features/washer/router';

const router = Router();

/**
 * Admin API is running...
 * @route GET /adm/v1
 */
router.get('/', (req, res) => {
    const message = 'ADM/v1 is running...';
    res.status(200).send({ status: 'ok', message });
});

/**
 * AUTHENTICATION
 * @see: src/features/auth/auth.routes.ts
 */
router.use('/auth', authRouter);

/**
 * AUTHENTICATION GUARDS
 * This api should only be available to ADMIN/SUPER users.
 * As this basically allow us to control every entity in the system
 * also, impersonation is NOT allowed.
 */
router.use(reqUserGuard.isAuthenticated);
router.use(reqUserGuard.isAdmin);
router.use(reqUserGuard.noImpersonation);

/**
 * Feature Routes
 * @see: src/features/
 */

router.use('/addresses', addressRouter);
router.use('/audits', auditRouter);
// router.use('/bookings', bookingRouter);
router.use('/caches', cacheRouter);
router.use('/chats', chatRouter);
// router.use('/contexts', contextRouter);
router.use('/coupons', couponRouter);
router.use('/geofence', geofenceRouter);
// router.use('/ics', icsRouter);
// router.use('/llm', llmRouter);
router.use('/offerings', offeringRouter);
router.use('/payments', paymentRouter);
router.use('/plans', planRouter);
router.use('/properties', propertyRouter);
router.use('/questions', questionRouter);
router.use('/ratings', ratingRouter);
router.use('/referrals', referralRouter);
// router.use('/schedule', scheduleRouter);
router.use('/schedule-exception', scheduleExceptionRouter);
router.use('/schedule-slot', scheduleSlotRouter);
router.use('/subscriptions', subscriptionRouter);
// router.use('/terms', termRouter);
router.use('/tickets', ticketRouter);
router.use('/transactions', transactionRouter);
router.use('/users', userRouter);
router.use('/vehicles', vehicleRouter);
router.use('/wallets', walletRouter);
router.use('/washers', washerRouter);

export { router as admRoutes };
export default router;
