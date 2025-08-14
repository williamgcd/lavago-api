import { Router } from 'express';
import { transactionController } from './controller';

const router = Router();

router.get('/entity/:entity/:entity_id', transactionController.listByEntityId);
router.get('/entity/:entity', transactionController.listByEntity);
router.get('/user/:user_id', transactionController.listByUserId);

router
    .route('/:transaction_id')
    .delete(transactionController.delete)
    .get(transactionController.getById)
    .patch(transactionController.update)
    .put(transactionController.update);

router
    .route('/')
    .get(transactionController.list)
    .post(transactionController.create)
    .put(transactionController.upsert);

export { router as transactionRouter };
