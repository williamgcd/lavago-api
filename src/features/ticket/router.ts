import { Router } from 'express';
import { ticketController } from './controller';

const router = Router();

router.get('/assigned/:assigned_to', ticketController.listByAssignedTo);
router.get('/entity/:entity/:entity_id', ticketController.listByEntityId);
router.get('/entity/:entity', ticketController.listByEntity);
router.get('/user/:user_id', ticketController.listByUserId);

router
    .route('/:ticket_id')
    .delete(ticketController.delete)
    .get(ticketController.getById)
    .patch(ticketController.update)
    .put(ticketController.update);

router
    .route('/')
    .get(ticketController.list)
    .post(ticketController.create)
    .put(ticketController.upsert);

export { router as ticketRouter };
