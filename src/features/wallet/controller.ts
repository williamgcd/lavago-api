import { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { PaginationDto } from '@/shared/dtos/pagination';
import { UuidDto } from '@/shared/dtos/uuid';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.WalletDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.WalletDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { wallet_id } = d.WalletDtoById.parse(req.params);
        await serv.delete(wallet_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { wallet_id } = d.WalletDtoById.parse(req.params);
        const record = await serv.getById(wallet_id);
        return respond.success(res, d.WalletDtoPublic.parse(record));
    },

    getByUserId: async (req: Request, res: Response) => {
        const { user_id } = d.WalletDtoByUserId.parse(req.params);
        const record = await serv.getByUserId(user_id as string);
        return respond.success(res, d.WalletDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.WalletDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.WalletDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    update: async (req: Request, res: Response) => {
        const msg = 'Wallet cannot be updated. Go through transactions instead';
        throw createHttpError.NotImplemented(msg);
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.wallet_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as walletController };
export default ctrl;
