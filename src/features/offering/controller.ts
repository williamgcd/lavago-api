import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.OfferingDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.OfferingDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { offering_id } = d.OfferingDtoById.parse(req.params);
        await serv.delete(offering_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { offering_id } = d.OfferingDtoById.parse(req.params);
        const record = await serv.getById(offering_id);
        return respond.success(res, d.OfferingDtoPublic.parse(record));
    },

    getByNum: async (req: Request, res: Response) => {
        const { num } = d.OfferingDtoByNum.parse(req.params);
        const record = await serv.getByNum(num);
        return respond.success(res, d.OfferingDtoPublic.parse(record));
    },

    getBySku: async (req: Request, res: Response) => {
        const { sku } = d.OfferingDtoBySku.parse(req.params);
        const record = await serv.getBySku(sku);
        return respond.success(res, d.OfferingDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.OfferingDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.OfferingDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.OfferingDtoById.parse(req.params);
        const values = d.OfferingDtoUpdate.parse(req.body || req.query);
        const { offering_id } = parsed;

        const record = await serv.update(offering_id, values);
        return respond.success(res, d.OfferingDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.offering_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as offeringController };
export default ctrl;
