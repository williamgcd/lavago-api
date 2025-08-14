import { Router } from 'express';
import { scheduleExceptionController } from './controller';

const router = Router();

router.get('/washer/:washer_id', scheduleExceptionController.listByWasherId);

router
    .route('/:schedule_exception_id')
    .delete(scheduleExceptionController.delete)
    .get(scheduleExceptionController.getById)
    .patch(scheduleExceptionController.update)
    .put(scheduleExceptionController.update);

router
    .route('/')
    .get(scheduleExceptionController.list)
    .post(scheduleExceptionController.create)
    .put(scheduleExceptionController.upsert);

export { router as scheduleExceptionRouter };
