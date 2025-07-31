import { Router } from 'express';
import { referralController } from './referral.controller';

const router = Router();

router.delete('/:referralId', referralController.deleteById);

router.get('/referrer/:referrerUserId', referralController.findByReferrerUserId);
router.get('/referred/:referredUserId', referralController.findByReferredUserId);
router.get('/:referralId', referralController.getById);
router.get('/', referralController.find);

router.post('/', referralController.create);

router.put('/:referralId', referralController.updateById);

export { router as referralRoutes };
export default router;
