import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.UserDtoCreate.parse(req.body);
        const record = await serv.create(values);
        return respond.created(res, d.UserDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { user_id } = d.UserDtoById.parse(req.params);
        await serv.delete(user_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { user_id } = d.UserDtoById.parse(req.params);
        const record = await serv.getById(user_id);
        return respond.success(res, d.UserDtoPublic.parse(record));
    },

    getByEmail: async (req: Request, res: Response) => {
        const { email } = d.UserDtoByEmail.parse(req.params);
        const record = await serv.getByEmail(email as string);
        return respond.success(res, d.UserDtoPublic.parse(record));
    },

    getByPhone: async (req: Request, res: Response) => {
        const { phone } = d.UserDtoByPhone.parse(req.params);
        const record = await serv.getByPhone(phone as string);
        return respond.success(res, d.UserDtoPublic.parse(record));
    },

    getByReferral: async (req: Request, res: Response) => {
        const { referral } = d.UserDtoByReferral.parse(req.params);
        const record = await serv.getByReferral(referral as string);
        return respond.success(res, d.UserDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.UserDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.UserDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.UserDtoById.parse(req.params);
        const values = d.UserDtoUpdate.parse(req.body);
        const { user_id } = parsed;

        const record = await serv.update(user_id, values);
        return respond.success(res, d.UserDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.user_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as userController };
export default ctrl;
