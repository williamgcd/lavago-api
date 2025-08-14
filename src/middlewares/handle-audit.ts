import { Request, Response, NextFunction } from 'express';
import { audit } from '@/shared/helpers/audit-log';
import { CONFIG } from '@/config';

export const handleAudit = {
    context: async (req: Request, res: Response, next: NextFunction) => {
        audit.setReqContextFromRequest(req);
        return next();
    },

    logs: async (req: Request, res: Response, next: NextFunction) => {
        if (CONFIG.NODE_ENV !== 'development') {
            return next();
        }
        const logs = audit.logsDump();
        logs.forEach(log => console.log('[AuditLog]', log));
        return next();
    },
};
