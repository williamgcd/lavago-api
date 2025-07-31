import { Router } from 'express';
import { ticketController } from './ticket.controller';

const router = Router();

router.delete('/:ticketId', ticketController.deleteById);

router.get('/assigned/:assignedTo', ticketController.findByAssignedTo);
router.get('/object/:object/:objectId', ticketController.findByObject);
router.get('/user/:userId', ticketController.findByUserId);
router.get('/:ticketId', ticketController.getById);
router.get('/', ticketController.find);

router.post('/', ticketController.create);

router.put('/:ticketId', ticketController.updateById);

export { router as ticketRoutes };
export default router;
