import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { geofencingCityCreateDTO, geofencingCityFindQueryDTO, geofencingCityGetByZipDTO, geofencingCityUpdateDTO } from "./geofencing-city.controller.dto";
import { geofencingCityService } from "./geofencing-city.service";
import { TGeofencingCity } from "./geofencing-city.schema";

export const geofencingCityController = {
    create: async (req: Request, res: Response) => {
        const parsed = geofencingCityCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const geofencingCity = await geofencingCityService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: geofencingCity,
        } as TResponse<TGeofencingCity>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { geofencingCityId } = req.params;
        if (!geofencingCityId) {
            throwInvalidRequestParam('GeofencingCityID is required');
        }
        await geofencingCityService.deleteById(geofencingCityId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = geofencingCityFindQueryDTO.safeParse(query);
        const { data, total } = await geofencingCityService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TGeofencingCity>);
    },

    getById: async (req: Request, res: Response) => {
        const { geofencingCityId } = req.params;
        if (!geofencingCityId) {
            throwInvalidRequestParam('GeofencingCityID is required');
        }
        const geofencingCity = await geofencingCityService.getById(geofencingCityId);
        res.status(200).json({
            status: 'ok',
            data: geofencingCity,
        } as TResponse<TGeofencingCity>);
    },

    getByIdentifier: async (req: Request, res: Response) => {
        const { identifier } = req.params;
        if (!identifier) {
            throwInvalidRequestParam('Identifier is required');
        }
        const geofencingCity = await geofencingCityService.getByIdentifier(identifier);
        res.status(200).json({
            status: 'ok',
            data: geofencingCity,
        } as TResponse<TGeofencingCity>);
    },

    getByZip: async (req: Request, res: Response) => {
        const { zip } = req.params;
        if (!zip) {
            throwInvalidRequestParam('Zip is required');
        }
        const parsed = geofencingCityGetByZipDTO.safeParse(req.params);
        if (!parsed.success) {
            throwInvalidRequestParam('Zip is required');
        }
        const geofencingCity = await geofencingCityService.getByZip(parsed.data.zip);
        res.status(200).json({
            status: 'ok',
            data: geofencingCity,
        } as TResponse<TGeofencingCity>);
    },

    updateById: async (req: Request, res: Response) => {
        const { geofencingCityId } = req.params;
        if (!geofencingCityId) {
            throwInvalidRequestParam('GeofencingCityID is required');
        }
        const parsed = geofencingCityUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const geofencingCity = await geofencingCityService.updateById(geofencingCityId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: geofencingCity,
        } as TResponse<TGeofencingCity>);
    },
};
