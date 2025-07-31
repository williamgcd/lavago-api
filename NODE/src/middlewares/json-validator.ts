import { Request, Response, NextFunction } from 'express';

export function jsonValidator(req: Request, res: Response, next: NextFunction) {
    if (!["POST", "PUT"].includes(req.method)) {
        return next();
    }
    // If body is undefined, it means body-parser did not parse it (likely not JSON)
    if (req.headers['content-type']?.includes('application/json')) {
        if (req.body === undefined) {
            return res.status(400).json({ error: 'Invalid or missing JSON in request body.' });
        }
    }
    next();
} 