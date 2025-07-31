import { Router } from 'express';
import { userController } from './user.controller';

const router = Router();

router.delete('/:userId', userController.deleteById);

router.get('/:userId', userController.getById);
router.get('/email/:email', userController.getByEmail);
router.get('/phone/:phone', userController.getByPhone);
router.get('/', userController.find);

router.patch('/otp/update/:phone', userController.otpUpdateByPhone);

router.post('/otp/check', userController.otpCheck);
router.post('/', userController.create);

router.put('/:userId', userController.updateById);

export { router as userRoutes };
export default router;