import { Request, Response } from 'express';

import { UuidDto } from '@/shared/dtos/uuid';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatUserDtoByChatId.parse(req.params);
        const { user_id } = d.ChatUserDtoByUserId.parse(req.params);

        const record = await serv.create(chat_id, user_id);
        return respond.created(res, d.ChatUserDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatUserDtoByChatId.parse(req.params);
        const { user_id } = d.ChatUserDtoByUserId.parse(req.params);

        await serv.delete(chat_id, user_id);
        return respond.deleted(res);
    },

    getUserById: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatUserDtoByChatId.parse(req.params);
        const { user_id } = d.ChatUserDtoByUserId.parse(req.params);

        const record = await serv.getUserById(chat_id, user_id);
        return respond.success(res, d.ChatUserDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatUserDtoByChatId.parse(req.params);

        const records = await serv.list(chat_id);
        const users = records.map(m => d.ChatUserDtoPublic.parse(m));
        return respond.success(res, users);
    },

    upsert: async (req: Request, res: Response) => {
        const { chat_id } = d.ChatUserDtoByChatId.parse(req.params);
        const { user_id } = d.ChatUserDtoByUserId.parse(req.params);

        const record = await serv.upsert(chat_id, user_id);
        return respond.success(res, d.ChatUserDtoPublic.parse(record));
    },
};

export { ctrl, ctrl as chatUserController };
export default ctrl;
