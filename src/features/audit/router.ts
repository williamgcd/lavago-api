import { Router } from 'express';
import { auditController } from './controller';

const router = Router();

router.get('/creator/:creator_user', auditController.listByCreatorUser);
router.get('/entity/:entity/id/:entity_id', auditController.listByEntityId);
router.get('/request/:request_id', auditController.listByRequestId);

router
    .route('/:audit_id')
    .delete(auditController.delete)
    .get(auditController.getById)
    .patch(auditController.update)
    .put(auditController.update);

router
    .route('/')
    .get(auditController.list)
    .post(auditController.create)
    .put(auditController.upsert);

export { router as auditRouter };
