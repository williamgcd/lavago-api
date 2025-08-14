import { Router } from 'express';

const router = Router();

/**
 * App API is running...
 * @route GET /app/v1
 */
router.get('/', (req, res) => {
    const message = 'APP/v1 is running...';
    res.status(200).send({ status: 'ok', message });
});

export { router as appRoutes };
export default router;
