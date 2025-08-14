import { Router } from 'express';
import { propertyController } from './controller';

const router = Router();

router
    .route('/:property_id')
    .delete(propertyController.delete)
    .get(propertyController.getById)
    .patch(propertyController.update)
    .put(propertyController.update);

router
    .route('/')
    .get(propertyController.list)
    .post(propertyController.create)
    .put(propertyController.upsert);

export { router as propertyRouter };
