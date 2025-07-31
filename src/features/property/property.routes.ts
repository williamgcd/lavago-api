import { Router } from "express";
import { propertyController } from "./property.controller";
import { propertyHourRoutes } from "../property-hour";

const router = Router();

router.use('/:propertyId/hours', propertyHourRoutes);

router.delete('/:propertyId', propertyController.deleteById);

router.get('/zip/:zip', propertyController.findByZip);
router.get('/:propertyId', propertyController.getById);
router.get('/', propertyController.find);

router.post('/', propertyController.create);

router.put('/:propertyId', propertyController.updateById);

export { router as propertyRoutes };
export default router;
