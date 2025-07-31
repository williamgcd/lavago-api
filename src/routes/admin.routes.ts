import { Router } from 'express';

import { authGuards, authRoutes } from '@/features/auth';

import { addressRoutes } from '@/features/address/address.routes';
import { bookingActionRoutes } from '@/features/booking-action/booking-action.routes';
import { bookingRoutes } from '@/features/booking/booking.routes';
import { chatRoutes } from '@/features/chat/chat.routes';
import { couponRoutes } from '@/features/coupon/coupon.routes';
import { geofencingRoutes } from '@/features/geofencing/geofencing.routes';
import { paymentRoutes } from '@/features/payment/payment.routes';
import { productRoutes } from '@/features/product/product.routes';
import { propertyRoutes } from '@/features/property/property.routes';
import { referralRoutes } from '@/features/referral/referral.routes';
import { subscriptionRoutes } from '@/features/subscription/subscription.routes';
import { ticketRoutes } from '@/features/ticket/ticket.routes';
import { transactionRoutes } from '@/features/transaction/transaction.routes';
import { userRoutes } from '@/features/user/user.routes';
import { vehicleRoutes } from '@/features/vehicle/vehicle.routes';
import { walletRoutes } from '@/features/wallet/wallet.routes';
import { washerRoutes } from '@/features/washer/washer.routes';

const router = Router();

router.get('/', async (_, res, next) => {
    res.status(200).json({
        status: 'ok',
        message: 'Admin/V1 API is running...',
    });
});

/**
 * AUTHENTICATION
 * @see: src/features/auth/auth.routes.ts
 */
router.use('/auth', authRoutes);

/**
 * ADMIN
 * It should be available only to ADMIN/SUPER
 * As they basically allow us to control every entity in the system
 * and no impersonation is allowed.
 */
// router.use(authGuards.byRole(['ADMIN', 'SUPER']));
// router.use(authGuards.noImpersonation);

router.use('/addresses', addressRoutes);
router.use('/booking-actions', bookingActionRoutes);
router.use('/bookings', bookingRoutes);
router.use('/chats', chatRoutes);
router.use('/coupons', couponRoutes);
router.use('/geofencing', geofencingRoutes);
router.use('/payments', paymentRoutes);
router.use('/products', productRoutes);
router.use('/properties', propertyRoutes);
router.use('/referrals', referralRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/tickets', ticketRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/wallets', walletRoutes);
router.use('/washers', washerRoutes);

export { router as adminRoutes };
export default router;