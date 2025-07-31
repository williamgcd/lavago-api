import { Router } from 'express';
import { paymentController } from './payment.controller';

const router = Router();

router.delete('/:paymentId', paymentController.deleteById);

router.get('/user/:userId', paymentController.findByUserId);
router.get('/provider/:paymentProviderId', paymentController.getByProviderId);
router.get('/:paymentId', paymentController.getById);
router.get('/', paymentController.find);

router.post('/', paymentController.create);

router.put('/:paymentId', paymentController.updateById);
router.put('/:paymentId/authorize', paymentController.authorize);
router.put('/:paymentId/confirm', paymentController.confirm);
router.put('/:paymentId/fail', paymentController.fail);
router.put('/:paymentId/refund', paymentController.refund);
router.put('/:paymentId/cancel', paymentController.cancel);

export { router as paymentRoutes };
export default router;
