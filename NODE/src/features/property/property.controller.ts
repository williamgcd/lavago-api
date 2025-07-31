import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { propertyCreateDTO, propertyFindQueryDTO, propertyUpdateDTO } from "./property.controller.dto";
import { propertyService } from "./property.service";
import { TProperty } from "./property.schema";
import { validatorUtils } from "@/utils/validators";
import { propertyPublicDTO } from "./property.dto";

export const propertyController = {
    create: async (req: Request, res: Response) => {
        const parsed = propertyCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const property = await propertyService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: property,
        } as TResponse<TProperty>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { propertyId } = req.params;
        if (!propertyId) {
            throwInvalidRequestParam('PropertyID is required');
        }
        await propertyService.deleteById(propertyId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = propertyFindQueryDTO.safeParse(query);
        const { data, total } = await propertyService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TProperty>);
    },

    findByZip: async (req: Request, res: Response) => {
        const { zip } = req.params;
        if (!zip) {
            throwInvalidRequestParam('Zip is required');
        }
        const validZip = validatorUtils.validateZip(zip);
        if (!validZip) {
            throwInvalidRequestParam('Zip is invalid');
        }

        const limitAsNumber = PAGINATION.DEFAULT_LIMIT;
        const { data, total } = await propertyService.findByZip(validZip);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TProperty>);

    },

    getById: async (req: Request, res: Response) => {
        const { propertyId } = req.params;
        if (!propertyId) {
            throwInvalidRequestParam('PropertyID is required');
        }
        const property = await propertyService.getById(propertyId);
        res.status(200).json({
            status: 'ok',
            data: property,
        } as TResponse<TProperty>);
    },

    updateById: async (req: Request, res: Response) => {
        const { propertyId } = req.params;
        if (!propertyId) {
            throwInvalidRequestParam('PropertyID is required');
        }
        const parsed = propertyUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const property = await propertyService.updateById(propertyId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: property,
        } as TResponse<TProperty>);
    },
};
