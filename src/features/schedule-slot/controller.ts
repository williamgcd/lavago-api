import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.ScheduleSlotDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.ScheduleSlotDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { schedule_slot_id } = d.ScheduleSlotDtoById.parse(req.params);
        await serv.delete(schedule_slot_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { schedule_slot_id } = d.ScheduleSlotDtoById.parse(req.params);
        const record = await serv.getById(schedule_slot_id);
        return respond.success(res, d.ScheduleSlotDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.ScheduleSlotDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.ScheduleSlotDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByBookingId: async (req: Request, res: Response) => {
        const parsed = d.ScheduleSlotDtoByBookingId.parse(req.params);
        req.query.booking_id = parsed.booking_id;
        ctrl.list(req, res);
    },

    listByWasherId: async (req: Request, res: Response) => {
        const parsed = d.ScheduleSlotDtoByWasherId.parse(req.params);
        req.query.washer_id = parsed.washer_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.ScheduleSlotDtoById.parse(req.params);
        const values = d.ScheduleSlotDtoUpdate.parse(req.body);
        const { schedule_slot_id } = parsed;

        const record = await serv.update(schedule_slot_id, values);
        return respond.success(res, d.ScheduleSlotDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.schedule_slot_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as scheduleSlotController };
export default ctrl;
