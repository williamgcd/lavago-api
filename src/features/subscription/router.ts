import { Router } from 'express';

import { subscriptionController } from './controller';

const router = Router();

router.get('/active', subscriptionController.listActive);
router.get('/plan/:plan_id', subscriptionController.getByPlanId);
router.get('/user/:user_id', subscriptionController.getByUserId);

router
    .route('/:subscription_id')
    .delete(subscriptionController.delete)
    .get(subscriptionController.getById)
    .patch(subscriptionController.update)
    .put(subscriptionController.update);

router
    .route('/')
    .get(subscriptionController.list)
    .post(subscriptionController.create)
    .put(subscriptionController.upsert);

export { router, router as subscriptionRouter };
export default router;
