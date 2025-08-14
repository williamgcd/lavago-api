import { Router } from 'express';
import { contextController } from './controller';

const router = Router();

/**
 * Get user context
 * @route GET /context
 */
router.get('/', contextController.getUserContext);

/**
 * Update user context
 * @route POST /context
 */
router.post('/', contextController.updateContext);

export default router;