import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.QuestionDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.QuestionDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { question_id } = d.QuestionDtoById.parse(req.params);
        await serv.delete(question_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { question_id } = d.QuestionDtoById.parse(req.params);
        const record = await serv.getById(question_id);
        return respond.success(res, d.QuestionDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.QuestionDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.QuestionDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByEntity: async (req: Request, res: Response) => {
        const parsed = d.QuestionDtoByEntity.parse(req.params);
        req.query.entity = parsed.entity;
        return ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.QuestionDtoById.parse(req.params);
        const values = d.QuestionDtoUpdate.parse(req.body || req.query);
        const { question_id } = parsed;

        const record = await serv.update(question_id, values);
        return respond.success(res, d.QuestionDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.question_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as questionController };
export default ctrl;
