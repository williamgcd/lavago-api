import { Router } from "express";
import { washerHourController } from "./washer-hour.controller";

const router = Router();

router.delete('/:washerHourId', washerHourController.deleteById);

router.get('/user/:userId/day/:dayOfWeek', washerHourController.getByUserIdAndDayOfWeek);
router.get('/user/:userId', washerHourController.findByUserId);
router.get('/:washerHourId', washerHourController.getById);
router.get('/', washerHourController.find);

router.post('/', washerHourController.create);

router.put('/:washerHourId', washerHourController.updateById);

export { router as washerHourRoutes };
export default router;
