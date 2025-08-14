import { Router } from 'express';
import { washerController } from './controller';

const router = Router();

router.get('/user/:user_id', washerController.getByUserId);

router
    .route('/:washer_id')
    .delete(washerController.delete)
    .get(washerController.getById)
    .patch(washerController.update)
    .put(washerController.update);

router
    .route('/')
    .get(washerController.list)
    .post(washerController.create)
    .put(washerController.upsert);

export { router as washerRouter };
