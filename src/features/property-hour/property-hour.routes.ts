import { Router } from "express";
import { propertyHourController } from "./property-hour.controller";

const router = Router();

// Inherits a url chunk from propertyRoutes
// url: /properties/:propertyId/hours

router.delete('/:propertyHourId', propertyHourController.deleteById);

router.get('/day/:dayOfWeek', propertyHourController.getByPropertyIdAndDay);
router.get('/:propertyHourId', propertyHourController.getById);
router.get('/', propertyHourController.findByPropertyId);

router.post('/', propertyHourController.create);

router.put('/:propertyHourId', propertyHourController.updateById);

export { router as propertyHourRoutes };
export default router;
