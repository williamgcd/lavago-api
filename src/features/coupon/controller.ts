import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.CouponDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.CouponDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { coupon_id } = d.CouponDtoById.parse(req.params);
        await serv.delete(coupon_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { coupon_id } = d.CouponDtoById.parse(req.params);
        const record = await serv.getById(coupon_id);
        return respond.success(res, d.CouponDtoPublic.parse(record));
    },

    getByCode: async (req: Request, res: Response) => {
        const { code } = d.CouponDtoByCode.parse(req.params);
        const record = await serv.getByCode(code);
        return respond.success(res, d.CouponDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.CouponDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.CouponDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByUserId: async (req: Request, res: Response) => {
        const parsed = d.CouponDtoByUserId.parse(req.params);
        req.query.user_id = parsed.user_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.CouponDtoById.parse(req.params);
        const values = d.CouponDtoUpdate.parse(req.body || req.query);
        const { coupon_id } = parsed;

        const record = await serv.update(coupon_id, values);
        return respond.success(res, d.CouponDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.coupon_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as couponController };
export default ctrl;
