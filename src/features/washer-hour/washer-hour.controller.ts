import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { washerHourCreateDTO, washerHourFindQueryDTO, washerHourGetByUserIdAndDayOfWeekDTO, washerHourUpdateDTO } from "./washer-hour.controller.dto";
import { washerHourService } from "./washer-hour.service";
import { TWasherHour } from "./washer-hour.schema";

export const washerHourController = {
    create: async (req: Request, res: Response) => {
        const parsed = washerHourCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washerHour = await washerHourService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: washerHour,
        } as TResponse<TWasherHour>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { washerHourId } = req.params;
        if (!washerHourId) {
            throwInvalidRequestParam('WasherHourID is required');
        }
        await washerHourService.deleteById(washerHourId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerHourFindQueryDTO.safeParse(query);
        const { data, total } = await washerHourService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherHour>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerHourFindQueryDTO.safeParse(query);
        const { data, total } = await washerHourService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherHour>);
    },

    getById: async (req: Request, res: Response) => {
        const { washerHourId } = req.params;
        if (!washerHourId) {
            throwInvalidRequestParam('WasherHourID is required');
        }
        const washerHour = await washerHourService.getById(washerHourId);
        res.status(200).json({
            status: 'ok',
            data: washerHour,
        } as TResponse<TWasherHour>);
    },

    getByUserIdAndDayOfWeek: async (req: Request, res: Response) => {
        const parsed = washerHourGetByUserIdAndDayOfWeekDTO.safeParse(req.params);
        if (!parsed.success) {
            throwInvalidRequestParam('UserID and DayOfWeek are required');
        }
        const { userId, dayOfWeek } = parsed.data;
        const washerHour = await washerHourService.getByUserIdAndDayOfWeek(userId, dayOfWeek);
        res.status(200).json({
            status: 'ok',
            data: washerHour,
        } as TResponse<TWasherHour>);
    },

    updateById: async (req: Request, res: Response) => {
        const { washerHourId } = req.params;
        if (!washerHourId) {
            throwInvalidRequestParam('WasherHourID is required');
        }
        const parsed = washerHourUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washerHour = await washerHourService.updateById(washerHourId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: washerHour,
        } as TResponse<TWasherHour>);
    },
};
