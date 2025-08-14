import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.RatingDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.RatingDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { rating_id } = d.RatingDtoById.parse(req.params);
        await serv.delete(rating_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { rating_id } = d.RatingDtoById.parse(req.params);
        const record = await serv.getById(rating_id);
        return respond.success(res, d.RatingDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.RatingDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.RatingDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByEntityId: async (req: Request, res: Response) => {
        const parsed = d.RatingDtoByEntityId.parse(req.params);
        req.query.entity = parsed.entity;
        req.query.entity_id = parsed.entity_id;
        return ctrl.list(req, res);
    },

    listByUserId: async (req: Request, res: Response) => {
        const parsed = d.RatingDtoByUserId.parse(req.params);
        req.query.user_id = parsed.user_id;
        return ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.RatingDtoById.parse(req.params);
        const values = d.RatingDtoUpdate.parse(req.body || req.query);
        const { rating_id } = parsed;

        const record = await serv.update(rating_id, values);
        return respond.success(res, d.RatingDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.rating_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as ratingController };
export default ctrl;
