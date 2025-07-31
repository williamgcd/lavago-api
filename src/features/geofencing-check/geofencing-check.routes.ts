import { Router } from "express";
import { geofencingCheckController } from "./geofencing-check.controller";

const router = Router();

router.delete('/:geofencingCheckId', geofencingCheckController.deleteById);

router.get('/zip/:zip', geofencingCheckController.getByZip);
router.get('/:geofencingCheckId', geofencingCheckController.getById);
router.get('/', geofencingCheckController.find);

router.post('/', geofencingCheckController.create);

router.put('/:geofencingCheckId', geofencingCheckController.updateById);

export { router as geofencingCheckRoutes };
export default router;
