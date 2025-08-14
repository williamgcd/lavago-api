import { Router } from 'express';
import { couponController } from './controller';

const router = Router();

router.get('/code/:code', couponController.getByCode);

router
    .route('/:coupon_id')
    .delete(couponController.delete)
    .get(couponController.getById)
    .patch(couponController.update)
    .put(couponController.update);

router
    .route('/')
    .get(couponController.list)
    .post(couponController.create)
    .put(couponController.upsert);

export { router as couponRouter }; 