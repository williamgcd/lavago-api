import { Router } from 'express';
import { questionController } from './controller';

const router = Router();

router.get('/entity/:entity', questionController.listByEntity);

router
    .route('/:question_id')
    .delete(questionController.delete)
    .get(questionController.getById)
    .patch(questionController.update)
    .put(questionController.update);

router
    .route('/')
    .get(questionController.list)
    .post(questionController.create)
    .put(questionController.upsert);

export { router as questionRouter };
