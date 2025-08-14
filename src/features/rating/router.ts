import { Router } from 'express';
import { ratingController } from './controller';

const router = Router();

router.get('/entity/:entity/:entity_id', ratingController.listByEntityId);
router.get('/user/:user_id', ratingController.listByUserId);

router
    .route('/:rating_id')
    .delete(ratingController.delete)
    .get(ratingController.getById)
    .patch(ratingController.update)
    .put(ratingController.update);

router
    .route('/')
    .get(ratingController.list)
    .post(ratingController.create)
    .put(ratingController.upsert);

export { router as ratingRouter };
