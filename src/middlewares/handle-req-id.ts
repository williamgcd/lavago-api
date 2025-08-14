import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to ensure every request has a unique request ID
 * Generates one if not provided by the client
 */
export const handleReqId = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Check if request ID already exists
    if (!req.headers['x-request-id'] && !(req as any).id) {
        // Generate a unique request ID
        const requestId = uuidv4();
        req.headers['x-request-id'] = requestId;
        (req as any).id = requestId;
    }

    // Ensure req.id is set for consistency
    if (!(req as any).id && req.headers['x-request-id']) {
        (req as any).id = req.headers['x-request-id'];
    }

    // Add request ID to response headers for debugging
    res.setHeader(
        'x-request-id',
        (req as any).id || req.headers['x-request-id']
    );

    next();
};
