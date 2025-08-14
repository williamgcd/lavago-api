import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { UuidDto } from '@/shared/dtos/uuid';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.ReferralDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.ReferralDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { referral_id } = d.ReferralDtoById.parse(req.params);
        await serv.delete(referral_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { referral_id } = d.ReferralDtoById.parse(req.params);
        const record = await serv.getById(referral_id);
        return respond.success(res, d.ReferralDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.ReferralDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.ReferralDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByReferral: async (req: Request, res: Response) => {
        const parsed = d.ReferralDtoByReferral.parse(req.params);
        req.query.referral = parsed.referral;
        return ctrl.list(req, res);
    },

    listByReferred: async (req: Request, res: Response) => {
        const parsed = d.ReferralDtoByReferred.parse(req.params);
        req.query.referred_user_id = parsed.referred_user_id;
        return ctrl.list(req, res);
    },

    listByReferrer: async (req: Request, res: Response) => {
        const parsed = d.ReferralDtoByReferrer.parse(req.params);
        req.query.referrer_user_id = parsed.referrer_user_id;
        return ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.ReferralDtoById.parse(req.params);
        const values = d.ReferralDtoUpdate.parse(req.body);
        const { referral_id } = parsed;

        const record = await serv.update(referral_id, values);
        return respond.success(res, d.ReferralDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.referral_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as referralController };
export default ctrl;
