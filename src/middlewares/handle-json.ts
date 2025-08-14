import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const handleJson = (req: Request, res: Response, next: NextFunction) => {
    // Its not a PATCH, POST, or PUT request? Ok, no need to parse it.
    if (!['PATCH', 'POST', 'PUT'].includes(req.method)) {
        return next();
    }
    if (!req.headers['content-type']?.includes('application/json')) {
        return next(createHttpError(415, 'Unsupported Media Type'));
    }
    if (!req.body) {
        return next(createHttpError(400, 'Missing request body'));
    }

    try {
        req.body = JSON.parse(req.body);
    } catch (error) {
        return next(createHttpError(400, 'Invalid JSON'));
    }
    next();
};
