import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.TransactionDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.TransactionDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { transaction_id } = d.TransactionDtoById.parse(req.params);
        await serv.delete(transaction_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { transaction_id } = d.TransactionDtoById.parse(req.params);
        const record = await serv.getById(transaction_id);
        return respond.success(res, d.TransactionDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.TransactionDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.TransactionDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByEntity: async (req: Request, res: Response) => {
        const parsed = d.TransactionDtoByEntity.parse(req.params);
        req.query.entity = parsed.entity;
        ctrl.list(req, res);
    },

    listByEntityId: async (req: Request, res: Response) => {
        const parsed = d.TransactionDtoByEntityId.parse(req.params);
        req.query.entity = parsed.entity;
        req.query.entity_id = parsed.entity_id;
        ctrl.list(req, res);
    },

    listByUserId: async (req: Request, res: Response) => {
        const parsed = d.TransactionDtoByUserId.parse(req.params);
        req.query.user_id = parsed.user_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.TransactionDtoById.parse(req.params);
        const values = d.TransactionDtoUpdate.parse(req.body);
        const { transaction_id } = parsed;

        const record = await serv.update(transaction_id, values);
        return respond.success(res, d.TransactionDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.transaction_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as transactionController };
export default ctrl;
