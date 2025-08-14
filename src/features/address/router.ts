import { Router } from 'express';
import { addressController } from './controller';

const router = Router();

router.get('/property/:property_id', addressController.listByPropertyId);
router.get('/user/:user_id', addressController.listByUserId);

router
    .route('/:address_id')
    .delete(addressController.delete)
    .get(addressController.getById)
    .patch(addressController.update)
    .put(addressController.update);

router
    .route('/')
    .get(addressController.list)
    .post(addressController.create)
    .put(addressController.upsert);

export { router as addressRouter };
