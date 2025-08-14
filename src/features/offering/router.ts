import { Router } from 'express';
import { offeringController } from './controller';

const router = Router();

router.get('/num/:num', offeringController.getByNum);
router.get('/sku/:sku', offeringController.getBySku);

router
    .route('/:offering_id')
    .delete(offeringController.delete)
    .get(offeringController.getById)
    .patch(offeringController.update)
    .put(offeringController.update);

router
    .route('/')
    .get(offeringController.list)
    .post(offeringController.create)
    .put(offeringController.upsert);

export { router as offeringRouter };
