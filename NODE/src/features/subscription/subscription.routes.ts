import { Router } from 'express';
import { subscriptionController } from './subscription.controller';

const router = Router();

router.delete('/:subscriptionId', subscriptionController.deleteById);

router.get('/user/:userId', subscriptionController.findByUserId);
router.get('/product/:productId', subscriptionController.findByProductId);
router.get('/:subscriptionId', subscriptionController.getById);
router.get('/', subscriptionController.find);

router.post('/', subscriptionController.create);

router.put('/:subscriptionId', subscriptionController.updateById);

export { router as subscriptionRoutes };
export default router;
