import { Request } from 'express';
import { TAuditDto, TAuditDtoCreate } from '@/features/audit/types';
import { auditService } from '@/features/audit/service';

type TReqContext = {
    creator_user: TAuditDto['creator_user'];
    creator_role: TAuditDto['creator_role'];
    request_id: TAuditDto['request_id'];
    request_ip: TAuditDto['request_ip'];
    request_ua: TAuditDto['request_ua'];
};

class AuditLog {
    private logs: TAuditDto[] = [];
    private reqContext = {} as TReqContext;

    async add(params: TAuditDtoCreate) {
        const data = {
            ...params,
            ...this.reqContext,
        };
        const audit = await auditService.create(data);
        this.logs.push(audit);
    }

    async log(params: TAuditDtoCreate) {
        return this.add(params);
    }

    logsCount() {
        return this.logs.length;
    }

    logsClear() {
        this.logs = [];
        this.reqContext = {} as TReqContext;
    }

    logsDump() {
        return [...this.logs];
    }

    setReqContextFromRequest(req: Request) {
        const user = (req as any).user || { id: '', role: '' };
        this.reqContext = {
            creator_user: user.id || user.user_id,
            creator_role: user.role,
            request_id: (req as any).id || req.headers['x-request-id'],
            request_ip: req.ip || req.socket?.remoteAddress,
            request_ua: req.get('User-Agent'),
        };
    }
}

export const audit = new AuditLog();
