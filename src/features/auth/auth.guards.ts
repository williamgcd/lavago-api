import { TUserRole } from "@/features/user/user.schema";
import { TResponseMessage } from "@/types/responses";

import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";

export const authGuards = {
    byRole: (roles: TUserRole[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = (req as any).user;
            if (!user) {
                return res.status(401).json({ 
                    status: 'unauthorized',
                    message: 'You are not authorized to access this resource',
                } as TResponseMessage);
            }
            if (!roles.includes(user.role)) {
                return res.status(403).json({ 
                    status: 'forbidden',
                    message: 'You are not authorized to access this resource',
                } as TResponseMessage);
            }
            next();
        }
    },

    byToken: async () => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const headers = req.headers.authorization;
            if (!headers || !headers.startsWith('Bearer ')) {
                return res.status(401).json({ 
                    status: 'unauthorized',
                    message: 'Missing or invalid Authorization header',
                } as TResponseMessage);
            }

            try {
                const token = headers.split(' ')[1];
                const payload = await authService.validateToken(token);
                (req as any).user = payload;
                next();
            } catch (err) {
                (req as any).user = null;
                return res.status(401).json({ 
                    status: 'unauthorized',
                    message: 'Invalid or expired token',
                } as TResponseMessage);
            }
        }
    },

    noImpersonation: (req: Request, res: Response, next: NextFunction) => {
        // TODO: Implement impersonation logic.
        return next()
    }
};