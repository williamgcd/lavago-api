import { Router } from "express";
import { washerProductController } from "./washer-product.controller";

const router = Router();

router.delete('/:washerProductId', washerProductController.deleteById);

router.get('/user/:userId/product/:productId', washerProductController.getByUserIdAndProductId);
router.get('/product/:productId', washerProductController.findByProductId);
router.get('/user/:userId', washerProductController.findByUserId);
router.get('/:washerProductId', washerProductController.getById);
router.get('/', washerProductController.find);

router.post('/', washerProductController.create);

router.put('/:washerProductId', washerProductController.updateById);

export { router as washerProductRoutes };
export default router; 