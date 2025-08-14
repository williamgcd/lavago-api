import { Router } from 'express';
import { userController } from './controller';

const router = Router();

router.get('/email/:email', userController.getByEmail);
router.get('/phone/:phone', userController.getByPhone);
router.get('/referral/:referral', userController.getByReferral);

router
    .route('/:user_id')
    .delete(userController.delete)
    .get(userController.getById)
    .patch(userController.update)
    .put(userController.update);

router
    .route('/')
    .get(userController.list)
    .post(userController.create)
    .put(userController.upsert);

export { router as userRouter };
