import { Router } from 'express';
import { referralController } from './controller';

const router = Router();

router.get('/referral/:referral', referralController.listByReferral);
router.get('/referred/:referred_user_id', referralController.listByReferred);
router.get('/referrer/:referrer_user_id', referralController.listByReferrer);

router
    .route('/:referral_id')
    .delete(referralController.delete)
    .get(referralController.getById)
    .patch(referralController.update)
    .put(referralController.update);

router
    .route('/')
    .get(referralController.list)
    .post(referralController.create)
    .put(referralController.upsert);

export { router as referralRouter };
