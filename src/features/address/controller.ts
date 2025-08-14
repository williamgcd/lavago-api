import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.AddressDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.AddressDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { address_id } = d.AddressDtoById.parse(req.params);
        await serv.delete(address_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { address_id } = d.AddressDtoById.parse(req.params);
        const record = await serv.getById(address_id);
        return respond.success(res, d.AddressDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.AddressDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.AddressDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByUserId: async (req: Request, res: Response) => {
        const { user_id } = d.AddressDtoByUserId.parse(req.params);
        req.query.user_id = user_id;
        ctrl.list(req, res);
    },

    listByPropertyId: async (req: Request, res: Response) => {
        const { property_id } = d.AddressDtoByPropertyId.parse(req.params);
        req.query.property_id = property_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.AddressDtoById.parse(req.params);
        const values = d.AddressDtoUpdate.parse(req.body);
        const { address_id } = parsed;

        const record = await serv.update(address_id, values);
        return respond.success(res, d.AddressDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.address_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as addressController };
export default ctrl;
