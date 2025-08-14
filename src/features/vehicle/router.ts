import { Router } from 'express';
import { vehicleController } from './controller';

const router = Router();

router.get('/user/:user_id', vehicleController.listByUserId);

router
    .route('/:vehicle_id')
    .delete(vehicleController.delete)
    .get(vehicleController.getById)
    .patch(vehicleController.update)
    .put(vehicleController.update);

router
    .route('/')
    .get(vehicleController.list)
    .post(vehicleController.create)
    .put(vehicleController.upsert);

export { router as vehicleRouter };
