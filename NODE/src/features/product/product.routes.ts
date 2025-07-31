import { Router } from "express";
import { productController } from "./product.controller";

const router = Router();

router.delete('/:productId', productController.deleteById);

router.get('/:productId', productController.getById);
router.get('/', productController.find);

router.post('/', productController.create);

router.put('/:productId', productController.updateById);

export { router as productRoutes };
export default router;
