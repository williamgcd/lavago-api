import { Router } from 'express';
import { transactionController } from './transaction.controller';

const router = Router();

router.delete('/:transactionId', transactionController.deleteById);

router.get('/object/:object/:objectId', transactionController.findByObject);
router.get('/user/:userId', transactionController.findByUserId);
router.get('/:transactionId', transactionController.getById);
router.get('/', transactionController.find);

router.post('/', transactionController.create);

router.put('/:transactionId', transactionController.updateById);

export { router as transactionRoutes };
export default router;
