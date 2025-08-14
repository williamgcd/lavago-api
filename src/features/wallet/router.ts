import { Router } from 'express';
import { walletController } from './controller';

const router = Router();

router.get('/user/:user_id', walletController.getByUserId);

router
    .route('/:wallet_id')
    .delete(walletController.delete)
    .get(walletController.getById)
    .patch(walletController.update)
    .put(walletController.update);

router
    .route('/')
    .get(walletController.list)
    .post(walletController.create)
    .put(walletController.upsert);

export { router as walletRouter };
