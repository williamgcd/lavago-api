import { Router } from 'express';

const router = Router();

/**
 * BOT API is running...
 * @route GET /bot/v1
 */
router.get('/', (req, res) => {
    const message = 'BOT/v1 is running...';
    res.status(200).send({ status: 'ok', message });
});

export { router as botRoutes };
export default router;
