import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.WasherDtoCreate.parse(req.body);
        const record = await serv.create(values);
        return respond.created(res, d.WasherDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { washer_id } = d.WasherDtoById.parse(req.params);
        await serv.delete(washer_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { washer_id } = d.WasherDtoById.parse(req.params);
        const record = await serv.getById(washer_id);
        return respond.success(res, d.WasherDtoPublic.parse(record));
    },

    getByUserId: async (req: Request, res: Response) => {
        const { user_id } = d.WasherDtoByUserId.parse(req.params);
        const record = await serv.getByUserId(user_id);
        return respond.success(res, d.WasherDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.WasherDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.WasherDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.WasherDtoById.parse(req.params);
        const values = d.WasherDtoUpdate.parse(req.body);
        const { washer_id } = parsed;

        const record = await serv.update(washer_id, values);
        return respond.success(res, d.WasherDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.washer_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as washerController };
export default ctrl;
