import { Request, Response, NextFunction } from 'express';

import { CONFIG } from '@/config';
import createHttpError from 'http-errors';

export const handleError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Show error message to the user, based on the error type;
    if (CONFIG.NODE_ENV === 'development') {
        console.info((err as Error).stack);
    }

    if (err instanceof createHttpError.HttpError) {
        const { status, message } = err;
        return res.status(status).json({ status, message });
    }

    res.status(500).send({
        status: 'error',
        message: 'Internal Server Error',
    });
};
