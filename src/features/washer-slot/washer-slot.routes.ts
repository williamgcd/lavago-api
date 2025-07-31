import { Router } from "express";
import { washerSlotController } from "./washer-slot.controller";

const router = Router();

router.delete('/:washerSlotId', washerSlotController.deleteById);

router.get('/user/:userId', washerSlotController.findByUserId);
router.get('/:washerSlotId', washerSlotController.getById);
router.get('/', washerSlotController.find);

router.post('/', washerSlotController.create);

router.put('/:washerSlotId', washerSlotController.updateById);

export { router as washerSlotRoutes };
export default router;