import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { UuidDto } from '@/shared/dtos/uuid';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.AuditDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.AuditDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { audit_id } = d.AuditDtoById.parse(req.params);
        await serv.delete(audit_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { audit_id } = d.AuditDtoById.parse(req.params);
        const record = await serv.getById(audit_id);
        return respond.success(res, d.AuditDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.AuditDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.AuditDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByCreatorUser: async (req: Request, res: Response) => {
        const creator_user = d.AuditDtoFilter['creator_user'].parse(req.params);
        req.query.creator_user = creator_user;
        return ctrl.list(req, res);
    },

    listByEntityId: async (req: Request, res: Response) => {
        const entity = d.AuditDtoFilter['entity'].parse(req.params);
        const entity_id = d.AuditDtoFilter['entity_id'].parse(req.params);
        req.query.entity = entity;
        req.query.entity_id = entity_id;
        return ctrl.list(req, res);
    },

    listByRequestId: async (req: Request, res: Response) => {
        const request_id = d.AuditDtoFilter['request_id'].parse(req.params);
        req.query.request_id = request_id;
        return ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.AuditDtoById.parse(req.params);
        const values = d.AuditDtoUpdate.parse(req.body);
        const { audit_id } = parsed;

        const record = await serv.update(audit_id, values);
        return respond.success(res, d.AuditDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.audit_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as auditController };
export default ctrl;
