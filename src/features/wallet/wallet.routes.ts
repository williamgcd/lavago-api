import { Router } from 'express';
import { walletController } from './wallet.controller';

const router = Router();

router.delete('/:walletId', walletController.deleteById);

router.get('/user/:userId', walletController.getByUserId);
router.get('/:walletId', walletController.getById);
router.get('/', walletController.find);

router.post('/', walletController.create);

router.put('/:walletId', walletController.updateById);

export { router as walletRoutes };
export default router;
