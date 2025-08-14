import { Router } from 'express';

const router = Router();

/**
 * MCP API is running...
 * @route GET /mcp/v1
 */
router.get('/', (req, res) => {
    const message = 'MCP/v1 is running...';
    res.status(200).send({ status: 'ok', message });
});

export { router as mcpRoutes };
export default router;
