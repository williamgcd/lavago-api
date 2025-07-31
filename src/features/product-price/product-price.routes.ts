import { Router } from "express";
import { productPriceController } from "./product-price.controller";

const router = Router();

// Inherits a url chunk from productRoutes
// url: /products/:productId/prices

router.delete('/:productPriceId', productPriceController.deleteById);

router.get('/vehicle/:vehicleType', productPriceController.getByProductIdAndVehicleType);
router.get('/:productPriceId', productPriceController.getById);
router.get('/', productPriceController.findByProductId);

router.post('/', productPriceController.create);

router.put('/:productPriceId', productPriceController.updateById);

export { router as productPriceRoutes };
export default router;
