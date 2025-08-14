import { Router } from 'express';
import { cacheController } from './controller';

const router = Router();

router.get('/entity/:entity/:entity_key', cacheController.getByEntityKey);
router.get('/entity/:entity', cacheController.listByEntity);

router
    .route('/:cache_id')
    .delete(cacheController.delete)
    .get(cacheController.getById)
    .patch(cacheController.update)
    .put(cacheController.update);

router
    .route('/')
    .get(cacheController.list)
    .post(cacheController.create)
    .put(cacheController.upsert);

export { router as cacheRouter };
