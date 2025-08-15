import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.ScheduleExceptionDtoCreate.parse(req.body);
        const record = await serv.create(values);
        return respond.created(res, d.ScheduleExceptionDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const parsed = d.ScheduleExceptionDtoById.parse(req.params);
        const { schedule_exception_id } = parsed;

        await serv.delete(schedule_exception_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const parsed = d.ScheduleExceptionDtoById.parse(req.params);
        const { schedule_exception_id } = parsed;

        const record = await serv.getById(schedule_exception_id);
        return respond.success(res, d.ScheduleExceptionDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.ScheduleExceptionDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.ScheduleExceptionDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByDate: async (req: Request, res: Response) => {
        const parsed = d.ScheduleExceptionDtoByDate.parse(req.params);
        req.query.date = parsed.date.toJSON().split('T')[0];
        ctrl.list(req, res);
    },

    listByWasherId: async (req: Request, res: Response) => {
        const parsed = d.ScheduleExceptionDtoByWasherId.parse(req.params);
        req.query.washer_id = parsed.washer_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.ScheduleExceptionDtoById.parse(req.params);
        const values = d.ScheduleExceptionDtoUpdate.parse(req.body);
        const { schedule_exception_id } = parsed;

        const record = await serv.update(schedule_exception_id, values);
        return respond.success(res, d.ScheduleExceptionDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.schedule_exception_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as scheduleExceptionController };
export default ctrl;
