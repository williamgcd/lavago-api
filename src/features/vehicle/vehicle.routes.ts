import { Router } from 'express';
import { vehicleController } from './vehicle.controller';

const router = Router();

router.delete('/:vehicleId', vehicleController.deleteById);

router.get('/user/:userId', vehicleController.findByUserId);
router.get('/:vehicleId', vehicleController.getById);
router.get('/', vehicleController.find);

router.post('/', vehicleController.create);

router.put('/:vehicleId', vehicleController.updateById);

export { router as vehicleRoutes };
export default router;
