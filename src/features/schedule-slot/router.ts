import { Router } from 'express';
import { scheduleSlotController } from './controller';

const router = Router();

router.get('/booking/:booking_id', scheduleSlotController.listByBookingId);
router.get('/washer/:washer_id', scheduleSlotController.listByWasherId);

router
    .route('/:schedule_slot_id')
    .delete(scheduleSlotController.delete)
    .get(scheduleSlotController.getById)
    .patch(scheduleSlotController.update)
    .put(scheduleSlotController.update);

router
    .route('/')
    .get(scheduleSlotController.list)
    .post(scheduleSlotController.create)
    .put(scheduleSlotController.upsert);

export { router as scheduleSlotRouter };
