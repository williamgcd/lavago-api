import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.CacheDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.CacheDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { cache_id } = d.CacheDtoById.parse(req.params);
        await serv.delete(cache_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { cache_id } = d.CacheDtoById.parse(req.params);
        const record = await serv.getById(cache_id);
        return respond.success(res, d.CacheDtoPublic.parse(record));
    },

    getByEntityKey: async (req: Request, res: Response) => {
        const { entity, entity_key } = d.CacheDtoByEntityKey.parse(req.params);
        const record = await serv.getByEntityKey(entity, entity_key);
        return respond.success(res, d.CacheDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.CacheDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.CacheDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByEntity: async (req: Request, res: Response) => {
        const { entity } = d.CacheDtoByEntity.parse(req.params);
        req.query.entity = entity;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.CacheDtoById.parse(req.params);
        const values = d.CacheDtoUpdate.parse(req.body || req.query);
        const { cache_id } = parsed;

        const record = await serv.update(cache_id, values);
        return respond.success(res, d.CacheDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.cache_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as cacheController };
export default ctrl;
