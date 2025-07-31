import { Router } from 'express';
import { bookingActionController } from './booking-action.controller';

const router = Router();

// Inherits a url chunk from chatRoutes
// url: /bookings/:bookingId/actions

router.delete('/:bookingActionId', bookingActionController.deleteById);

router.get('/:bookingActionId', bookingActionController.getById);
router.get('/', bookingActionController.findByBookingId);

router.post('/', bookingActionController.create);

router.put('/:bookingActionId', bookingActionController.updateById);

export { router as bookingActionRoutes };
export default router;
