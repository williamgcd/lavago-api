import { Router } from "express";
import { geofencingCityController } from "./geofencing-city.controller";

const router = Router();

router.delete('/:geofencingCityId', geofencingCityController.deleteById);

router.get('/identifier/:identifier', geofencingCityController.getByIdentifier);
router.get('/:geofencingCityId', geofencingCityController.getById);
router.get('/', geofencingCityController.find);

router.post('/', geofencingCityController.create);

router.put('/:geofencingCityId', geofencingCityController.updateById);

export { router as geofencingCityRoutes };
export default router;
