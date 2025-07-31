import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { propertyHourCreateDTO, propertyHourFindQueryDTO, propertyHourGetByPropertyIdAndDayDTO, propertyHourUpdateDTO } from "./property-hour.controller.dto";
import { propertyHourService } from "./property-hour.service";
import { TPropertyHour } from "./property-hour.schema";

export const propertyHourController = {
    create: async (req: Request, res: Response) => {
        const parsed = propertyHourCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const propertyHour = await propertyHourService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: propertyHour,
        } as TResponse<TPropertyHour>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { propertyHourId } = req.params;
        if (!propertyHourId) {
            throwInvalidRequestParam('PropertyHourID is required');
        }
        await propertyHourService.deleteById(propertyHourId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = propertyHourFindQueryDTO.safeParse(query);
        const { data, total } = await propertyHourService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TPropertyHour>);
    },

    findByPropertyId: async (req: Request, res: Response) => {
        const { propertyId } = req.params;
        if (!propertyId) {
            throwInvalidRequestParam('PropertyID is required');
        }
        const { data: propertyHours } = await propertyHourService.findByPropertyId(propertyId);
        res.status(200).json({
            status: 'ok',
            data: propertyHours,
        } as TResponse<TPropertyHour[]>);
    },

    getById: async (req: Request, res: Response) => {
        const { propertyHourId } = req.params;
        if (!propertyHourId) {
            throwInvalidRequestParam('PropertyHourID is required');
        }
        const propertyHour = await propertyHourService.getById(propertyHourId);
        res.status(200).json({
            status: 'ok',
            data: propertyHour,
        } as TResponse<TPropertyHour>);
    },

    getByPropertyIdAndDay: async (req: Request, res: Response) => {
        const { propertyId, dayOfWeek } = req.params;
        if (!propertyId || !dayOfWeek) {
            throwInvalidRequestParam('PropertyID and DayOfWeek are required');
        }
        const parsed = propertyHourGetByPropertyIdAndDayDTO.safeParse({ propertyId, dayOfWeek });
        if (!parsed.success) {
            throwInvalidRequestParam('PropertyID and DayOfWeek are required');
        }
        const propertyHour = await propertyHourService.getByPropertyIdAndDay(parsed.data.propertyId, parsed.data.dayOfWeek);
        res.status(200).json({
            status: 'ok',
            data: propertyHour,
        } as TResponse<TPropertyHour>);
    },

    updateById: async (req: Request, res: Response) => {
        const { propertyHourId } = req.params;
        if (!propertyHourId) {
            throwInvalidRequestParam('PropertyHourID is required');
        }
        const parsed = propertyHourUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const propertyHour = await propertyHourService.updateById(propertyHourId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: propertyHour,
        } as TResponse<TPropertyHour>);
    },
};
