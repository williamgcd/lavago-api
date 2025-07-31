import { Router } from "express";
import { washerController } from "./washer.controller";

const router = Router();

router.delete('/:washerId', washerController.deleteById);

router.get('/user/:userId', washerController.findByUserId);
router.get('/:washerId', washerController.getById);
router.get('/', washerController.find);

router.post('/', washerController.create);

router.put('/:washerId', washerController.updateById);

export { router as washerRoutes };
export default router;
