import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.ChatDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.ChatDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatDtoById.parse(req.params);
        await serv.delete(chat_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatDtoById.parse(req.params);
        const record = await serv.getById(chat_id);
        return respond.success(res, d.ChatDtoPublic.parse(record));
    },

    getByEntityId: async (req: Request, res: Response) => {
        const { entity, entity_id } = d.ChatDtoByEntityId.parse(req.params);
        const record = await serv.getByEntityId(entity, entity_id);
        return respond.success(res, d.ChatDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.ChatDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.ChatDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByEntity: async (req: Request, res: Response) => {
        const parsed = d.ChatDtoByEntity.parse(req.params);
        req.query.entity = parsed.entity;
        return ctrl.list(req, res);
    },

    listByUserId: async (req: Request, res: Response) => {
        const parsed = d.ChatDtoByUserId.parse(req.params);
        req.query.user_id = parsed.user_id;
        return ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.ChatDtoById.parse(req.params);
        const values = d.ChatDtoUpdate.parse(req.body);
        const { chat_id } = parsed;

        const record = await serv.update(chat_id, values);
        return respond.success(res, d.ChatDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.chat_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as chatController };
export default ctrl;
