import { Router } from 'express';
import { paymentPagbankWebhook } from './payment/pagbank';

const router = Router();

router.use('/payment/pagbank/:payment_id', paymentPagbankWebhook);
router.use('/payment/pagbank', paymentPagbankWebhook);

// PagBank webhook endpoints
// router.post('/pagbank/payment', PagBankPaymentWebhook.createMiddleware({
//     secret: process.env.PAGBANK_WEBHOOK_SECRET || 'default-secret',
//     signatureHeader: 'x-pagbank-signature',
// }));

export { router as webhookRoutes };
export default router;
