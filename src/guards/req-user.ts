import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export const reqUserGuard = {
    isAdmin: (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !user.role || !['admin', 'super'].includes(user.role)) {
            console.error('User is not an admin');
            return next(createHttpError.Unauthorized());
        }
        next();
    },

    isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !user.user_id) {
            console.error('User is not authenticated');
            return next(createHttpError.Unauthorized());
        }
        next();
    },

    noImpersonation: (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !!user.impersonator_id) {
            console.error('User is impersonating another user');
            return next(createHttpError.Unauthorized());
        }
        next();
    },
};
