import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.PlanDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.PlanDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { plan_id } = d.PlanDtoById.parse(req.params);
        await serv.delete(plan_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { plan_id } = d.PlanDtoById.parse(req.params);
        const record = await serv.getById(plan_id);
        return respond.success(res, d.PlanDtoPublic.parse(record));
    },

    getByCode: async (req: Request, res: Response) => {
        const { code } = d.PlanDtoByCode.parse(req.params);
        const record = await serv.getByCode(code);
        return respond.success(res, d.PlanDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.PlanDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.PlanDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listAvailable: async (req: Request, res: Response) => {
        req.query.is_available = 'true';
        return ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.PlanDtoById.parse(req.params);
        const values = d.PlanDtoUpdate.parse(req.body);
        const { plan_id } = parsed;

        const record = await serv.update(plan_id, values);
        return respond.success(res, d.PlanDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.plan_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as planController };
export default ctrl;
