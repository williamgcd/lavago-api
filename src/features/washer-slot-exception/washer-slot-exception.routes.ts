import { Router } from "express";
import { washerSlotExceptionController } from "./washer-slot-exception.controller";

const router = Router();

router.delete('/:washerSlotExceptionId', washerSlotExceptionController.deleteById);

router.get('/user/:userId', washerSlotExceptionController.findByUserId);
router.get('/:washerSlotExceptionId', washerSlotExceptionController.getById);
router.get('/', washerSlotExceptionController.find);

router.post('/', washerSlotExceptionController.create);

router.put('/:washerSlotExceptionId', washerSlotExceptionController.updateById);

export { router as washerSlotExceptionRoutes };
export default router;