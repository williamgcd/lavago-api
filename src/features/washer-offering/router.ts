import { Router } from 'express';
import { washerOfferingController } from './controller';

const router = Router();

router.get('/offering/:offering_id', washerOfferingController.listByOfferingId);
router.get('/washer/:washer_id', washerOfferingController.listByWasherId);

router
    .route('/:washer_offering_id')
    .delete(washerOfferingController.delete)
    .get(washerOfferingController.getById)
    .patch(washerOfferingController.update)
    .put(washerOfferingController.update);

router
    .route('/')
    .get(washerOfferingController.list)
    .post(washerOfferingController.create)
    .put(washerOfferingController.upsert);

export { router as washerOfferingRouter };
