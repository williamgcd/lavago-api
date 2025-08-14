import { Request, Response } from 'express';

import { PaginationDto } from '@/shared/dtos/pagination';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.VehicleDtoCreate.parse(req.body || req.query);
        const record = await serv.create(values);
        return respond.created(res, d.VehicleDtoPublic.parse(record));
    },

    delete: async (req: Request, res: Response) => {
        const { vehicle_id } = d.VehicleDtoById.parse(req.params);
        await serv.delete(vehicle_id);
        return respond.deleted(res);
    },

    getById: async (req: Request, res: Response) => {
        const { vehicle_id } = d.VehicleDtoById.parse(req.params);
        const record = await serv.getById(vehicle_id);
        return respond.success(res, d.VehicleDtoPublic.parse(record));
    },

    list: async (req: Request, res: Response) => {
        const filters = d.VehicleDtoFilter.parse(req.query);
        const pagination = PaginationDto.parse(req.query);

        const { count, data } = await serv.list(filters, pagination);
        const records = d.VehicleDtoPublic.array().parse(data);

        return respond.paginated(res, records, {
            limit: pagination.limit,
            page: pagination.page,
            pages: Math.ceil(count / pagination.limit),
            total: count,
        });
    },

    listByUserId: async (req: Request, res: Response) => {
        const parsed = d.VehicleDtoByUserId.parse(req.params);
        req.query.user_id = parsed.user_id;
        ctrl.list(req, res);
    },

    update: async (req: Request, res: Response) => {
        const parsed = d.VehicleDtoById.parse(req.params);
        const values = d.VehicleDtoUpdate.parse(req.body || req.query);
        const { vehicle_id } = parsed;

        const record = await serv.update(vehicle_id, values);
        return respond.success(res, d.VehicleDtoPublic.parse(record));
    },

    upsert: async (req: Request, res: Response) => {
        if (!req.body.id) {
            return ctrl.create(req, res);
        }
        req.params.vehicle_id = req.body.id;
        return ctrl.update(req, res);
    },
};

export { ctrl, ctrl as vehicleController };
export default ctrl;
