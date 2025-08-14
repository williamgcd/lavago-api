import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.SubscriptionDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.SubscriptionDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { subscription_id } = d.SubscriptionDtoById.parse(req.params);
        await serv.delete(subscription_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { subscription_id } = d.SubscriptionDtoById.parse(req.params);
        const record = await serv.getById(subscription_id);
        return respond.success(res, d.SubscriptionDtoPublic.parse(record));
    },

    getByPlanId: async (req: Request, res: Response) => {
        const { plan_id } = d.SubscriptionDtoByPlanId.parse(req.params);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.getByPlanId(plan_id, pagination);
        const records = d.SubscriptionDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    getByUserId: async (req: Request, res: Response) => {
        const { user_id } = d.SubscriptionDtoByUserId.parse(req.params);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.getByUserId(user_id, pagination);
        const records = d.SubscriptionDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    list: async (req: Request, res: Response) => {
        const filters = d.SubscriptionDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.SubscriptionDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listActive: async (req: Request, res: Response) => {
        const filters = d.SubscriptionDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.listActive(filters, pagination);
        const records = d.SubscriptionDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.SubscriptionDtoById.parse(req.params);
        const values = d.SubscriptionDtoUpdate.parse(req.body);
        const { subscription_id } = parsed;

        const record = await serv.update(subscription_id, values);
        return respond.success(res, d.SubscriptionDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.subscription_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as subscriptionController };
export default ctrl;
