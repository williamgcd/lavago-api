import { Router } from 'express';
import { addressController } from './address.controller';

const router = Router();

router.delete('/:addressId', addressController.deleteById);

router.get('/user/:userId', addressController.findByUserId);
router.get('/:addressId', addressController.getById);
router.get('/', addressController.find);

router.post('/', addressController.create);

router.put('/:addressId', addressController.updateById);

export { router as addressRoutes }; 
export default router;