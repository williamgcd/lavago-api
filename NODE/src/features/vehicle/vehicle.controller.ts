import { Request, Response } from 'express';
import { PAGINATION } from '@/constants/pagination';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';

import { vehicleCreateDTO, vehicleFindQueryDTO, vehicleUpdateDTO } from "./vehicle.controller.dto";
import { vehicleService } from "./vehicle.service";
import { TVehicle } from './vehicle.schema';

export const vehicleController = {
    create: async (req: Request, res: Response) => {
        const parsed = vehicleCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const vehicle = await vehicleService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: vehicle,
        } as TResponse<TVehicle>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            throwInvalidRequestParam('VehicleID is required');
        }
        await vehicleService.deleteById(vehicleId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = vehicleFindQueryDTO.safeParse(query);
        const { data, total } = await vehicleService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TVehicle>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = vehicleFindQueryDTO.safeParse(query);
        const { data, total } = await vehicleService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);
        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TVehicle>);
    },

    getById: async (req: Request, res: Response) => {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            throwInvalidRequestParam('VehicleID is required');
        }
        const vehicle = await vehicleService.getById(vehicleId);
        res.status(200).json({ status: 'ok', data: vehicle } as TResponse<TVehicle>);
    },

    updateById: async (req: Request, res: Response) => {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            throwInvalidRequestParam('VehicleID is required');
        }

        const parsed = vehicleUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }

        const vehicle = await vehicleService.updateById(vehicleId, parsed.data);
        res.status(200).json({ status: 'ok', data: vehicle } as TResponse<TVehicle>);
    },
};
