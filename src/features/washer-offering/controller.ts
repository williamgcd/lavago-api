import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.WasherOfferingDtoCreate.parse(req.body);
        const record = await serv.create(values);
        return respond.created(res, d.WasherOfferingDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const parsed = d.WasherOfferingDtoById.parse(req.params);
        const { washer_offering_id } = parsed;
        await serv.delete(washer_offering_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const parsed = d.WasherOfferingDtoById.parse(req.params);
        const { washer_offering_id } = parsed;
        const record = await serv.getById(washer_offering_id);
        return respond.success(res, d.WasherOfferingDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.WasherOfferingDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.WasherOfferingDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByOfferingId: async (req: Request, res: Response) => {
        const parsed = d.WasherOfferingDtoByOfferingId.parse(req.params);
        req.query.offering_id = parsed.offering_id;
        ctrl.list(req, res);
    },

    listByWasherId: async (req: Request, res: Response) => {
        const parsed = d.WasherOfferingDtoByWasherId.parse(req.params);
        req.query.washer_id = parsed.washer_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.WasherOfferingDtoById.parse(req.params);
        const values = d.WasherOfferingDtoUpdate.parse(req.body || req.query);
        const { washer_offering_id } = parsed;

        const record = await serv.update(washer_offering_id, values);
        return respond.success(res, d.WasherOfferingDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.washer_offering_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as washerOfferingController };
export default ctrl;
