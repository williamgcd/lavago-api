import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import * as t from './types';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.PaymentDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.PaymentDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { payment_id } = d.PaymentDtoById.parse(req.params);
        await serv.delete(payment_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { payment_id } = d.PaymentDtoById.parse(req.params);
        const record = await serv.getById(payment_id);
        return respond.success(res, d.PaymentDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.PaymentDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.PaymentDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByEntity: async (req: Request, res: Response) => {
        const parsed = d.PaymentDtoByEntity.parse(req.params);
        req.query.entity = parsed.entity;
        ctrl.list(req, res);
    },

    listByEntityId: async (req: Request, res: Response) => {
        const parsed = d.PaymentDtoByEntityId.parse(req.params);
        req.query.entity = parsed.entity;
        req.query.entity_id = parsed.entity_id;
        ctrl.list(req, res);
    },

    listByUserId: async (req: Request, res: Response) => {
        const parsed = d.PaymentDtoByUserId.parse(req.params);
        req.query.user_id = parsed.user_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.PaymentDtoById.parse(req.params);
        const values = d.PaymentDtoUpdate.parse(req.body);
        const { payment_id } = parsed;

        const record = await serv.update(payment_id, values);
        return respond.success(res, d.PaymentDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.payment_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as paymentController };
export default ctrl;
