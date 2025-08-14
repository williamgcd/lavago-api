import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export const handleLimiter =
    (limiter: 'basic' | 'strict') =>
    (req: Request, res: Response, next: NextFunction) => {
        const limiters = {
            basic: rateLimit({
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 100, // limit each IP to 100 requests per windowMs
                standardHeaders: true,
                legacyHeaders: false,
                message: 'Too many requests, please try again later.',
            }),
            strict: rateLimit({
                windowMs: 1 * 60 * 1000, // 1 minute
                max: 10, // limit each IP to 10 requests per windowMs
                standardHeaders: true,
                legacyHeaders: false,
                message: 'Too many requests, please try again later.',
            }),
        };
        return limiters[limiter](req, res, next);
    };
