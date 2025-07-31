import { Router } from 'express';
import { bookingActionRoutes } from '../booking-action/booking-action.routes';
import { bookingController } from './booking.controller';

const router = Router();

router.use('/:bookingId/actions', bookingActionRoutes);

// Core CRUD operations
router.delete('/:bookingId', bookingController.deleteById);

router.get('/client/:clientId', bookingController.findByClientId);
router.get('/washer/:washerId', bookingController.findByWasherId);
router.get('/:bookingId', bookingController.getById);
router.get('/', bookingController.find);

router.post('/', bookingController.create);

router.put('/:bookingId', bookingController.updateById);

export { router as bookingRoutes };
export default router;
