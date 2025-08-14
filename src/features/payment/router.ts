import { Router } from 'express';

import { paymentController } from './controller';

const router = Router();

router.get('/entity/:entity/:entity_id', paymentController.listByEntityId);
router.get('/entity/:entity', paymentController.listByEntity);
router.get('/user/:user_id', paymentController.listByUserId);

router
    .route('/:payment_id')
    .delete(paymentController.delete)
    .get(paymentController.getById)
    .patch(paymentController.update)
    .put(paymentController.update);

router
    .route('/')
    .get(paymentController.list)
    .post(paymentController.create)
    .put(paymentController.upsert);

export { router, router as paymentRouter };
export default router;
