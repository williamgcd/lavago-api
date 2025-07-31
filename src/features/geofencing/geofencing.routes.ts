import { Router } from "express";

import { geofencingCityRoutes } from "../geofencing-city";
import { geofencingCheckRoutes } from "../geofencing-check";

import { geofencingController } from "./geofencing.controller";

const router = Router();

router.use('/checks', geofencingCheckRoutes);
router.use('/cities', geofencingCityRoutes);

router.get('/zip/:zip', geofencingController.checkZip);

export { router as geofencingRoutes };
export default router;
