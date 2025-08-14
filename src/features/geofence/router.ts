import { Router } from 'express';

import { geofenceController } from './controller';

const router = Router();

router.get('/zip/:zip_code', geofenceController.getByZipCode);
router.get('/zip', geofenceController.getByZipCode);

router.post('/zip', geofenceController.getByZipCode);

export { router as geofenceRouter };
export default router;
