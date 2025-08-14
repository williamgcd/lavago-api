import { Router } from 'express';

import { planController } from './controller';

const router = Router();

router.get('/available', planController.listAvailable);
router.get('/code/:code', planController.getByCode);

router
    .route('/:plan_id')
    .delete(planController.delete)
    .get(planController.getById)
    .patch(planController.update)
    .put(planController.update);

router
    .route('/')
    .get(planController.list)
    .post(planController.create)
    .put(planController.upsert);

export { router, router as planRouter };
export default router;
