import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { UuidDto } from '@/shared/dtos/uuid';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const reqMessageId = (req: Request) => {
    const data = req.params || req.query;
    const { message_id } = d.ChatMessageDtoById.parse(req.params);
    return UuidDto.parse(message_id);
};

const ctrl = {
    create: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatMessageDtoByChatId.parse(req.params);
        const values = d.ChatMessageDtoCreate.parse(req.body);

        const record = await serv.create(chat_id, values);
        return respond.created(res, d.ChatMessageDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatMessageDtoByChatId.parse(req.params);
        const { message_id } = d.ChatMessageDtoById.parse(req.params);
        await serv.delete(chat_id, message_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatMessageDtoByChatId.parse(req.params);
        const { message_id } = d.ChatMessageDtoById.parse(req.params);
        const record = await serv.getById(chat_id, message_id);
        return respond.success(res, d.ChatMessageDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.ChatMessageDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { chat_id } = d.ChatMessageDtoByChatId.parse(req.params);
        filters.chat_id = chat_id;

        const { count, data } = await serv.list(filters, pagination);
        const records = d.ChatMessageDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByChatId: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatMessageDtoByChatId.parse(req.params);
        req.query.chat_id = chat_id;
        return ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatMessageDtoByChatId.parse(req.params);

        const parsed = d.ChatMessageDtoById.parse(req.params);
        const values = d.ChatMessageDtoUpdate.parse(req.body);
        const { message_id } = parsed;

        const record = await serv.update(chat_id, message_id, values);
        return respond.success(res, d.ChatMessageDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.message_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as chatMessageController };
export default ctrl;
