import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { geofencingCheckCreateDTO, geofencingCheckFindQueryDTO, geofencingCheckGetByZipDTO, geofencingCheckUpdateDTO } from "./geofencing-check.controller.dto";
import { geofencingCheckService } from "./geofencing-check.service";
import { TGeofencingCheck } from "./geofencing-check.schema";

export const geofencingCheckController = {
    create: async (req: Request, res: Response) => {
        const parsed = geofencingCheckCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const geofencingCheck = await geofencingCheckService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: geofencingCheck,
        } as TResponse<TGeofencingCheck>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { geofencingCheckId } = req.params;
        if (!geofencingCheckId) {
            throwInvalidRequestParam('GeofencingCheckID is required');
        }
        await geofencingCheckService.deleteById(geofencingCheckId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = geofencingCheckFindQueryDTO.safeParse(query);
        const { data, total } = await geofencingCheckService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TGeofencingCheck>);
    },

    getById: async (req: Request, res: Response) => {
        const { geofencingCheckId } = req.params;
        if (!geofencingCheckId) {
            throwInvalidRequestParam('GeofencingCheckID is required');
        }
        const geofencingCheck = await geofencingCheckService.getById(geofencingCheckId);
        res.status(200).json({
            status: 'ok',
            data: geofencingCheck,
        } as TResponse<TGeofencingCheck>);
    },

    getByZip: async (req: Request, res: Response) => {
        const { zip } = req.params;
        if (!zip) {
            throwInvalidRequestParam('Zip is required');
        }
        const parsed = geofencingCheckGetByZipDTO.safeParse(req.params);
        if (!parsed.success) {
            throwInvalidRequestParam('Zip is required');
        }
        const geofencingCheck = await geofencingCheckService.getByZip(parsed.data.zip);
        res.status(200).json({
            status: 'ok',
            data: geofencingCheck,
        } as TResponse<TGeofencingCheck>);
    },

    updateById: async (req: Request, res: Response) => {
        const { geofencingCheckId } = req.params;
        if (!geofencingCheckId) {
            throwInvalidRequestParam('GeofencingCheckID is required');
        }
        const parsed = geofencingCheckUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const geofencingCheck = await geofencingCheckService.updateById(geofencingCheckId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: geofencingCheck,
        } as TResponse<TGeofencingCheck>);
    },
};
