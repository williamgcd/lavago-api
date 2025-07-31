import { Router } from "express";
import { couponController } from "./coupon.controller";

const router = Router();

router.delete('/:couponId', couponController.deleteById);

router.get('/code/:code', couponController.getByCode);
router.get('/user/:userId', couponController.findByUserId);
router.get('/:couponId', couponController.getById);
router.get('/', couponController.find);

router.post('/', couponController.create);
router.post('/:couponId/use', couponController.useCoupon);

router.put('/:couponId', couponController.updateById);

export { router as couponRoutes };
export default router;
