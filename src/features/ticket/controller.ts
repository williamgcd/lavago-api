import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.TicketDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.TicketDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { ticket_id } = d.TicketDtoById.parse(req.params);
        await serv.delete(ticket_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { ticket_id } = d.TicketDtoById.parse(req.params);
        const record = await serv.getById(ticket_id);
        return respond.success(res, d.TicketDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.TicketDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.TicketDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByAssignedTo: async (req: Request, res: Response) => {
        const parsed = d.TicketDtoByAssignedTo.parse(req.params);
        req.query.assigned_to = parsed.assigned_to;
        ctrl.list(req, res);
    },

    listByEntity: async (req: Request, res: Response) => {
        const parsed = d.TicketDtoByEntity.parse(req.params);
        req.query.entity = parsed.entity;
        ctrl.list(req, res);
    },

    listByEntityId: async (req: Request, res: Response) => {
        const parsed = d.TicketDtoByEntityId.parse(req.params);
        req.query.entity = parsed.entity;
        req.query.entity_id = parsed.entity_id;
        ctrl.list(req, res);
    },

    listByUserId: async (req: Request, res: Response) => {
        const parsed = d.TicketDtoByUserId.parse(req.params);
        req.query.user_id = parsed.user_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.TicketDtoById.parse(req.params);
        const values = d.TicketDtoUpdate.parse(req.body);
        const { ticket_id } = parsed;

        const record = await serv.update(ticket_id, values);
        return respond.success(res, d.TicketDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.ticket_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as ticketController };
export default ctrl;
