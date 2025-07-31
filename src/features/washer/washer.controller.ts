import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { washerCreateDTO, washerFindQueryDTO, washerUpdateDTO } from "./washer.controller.dto";
import { washerService } from "./washer.service";
import { TWasher } from "./washer.schema";

export const washerController = {
    create: async (req: Request, res: Response) => {
        const parsed = washerCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washer = await washerService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: washer,
        } as TResponse<TWasher>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { washerId } = req.params;
        if (!washerId) {
            throwInvalidRequestParam('WasherID is required');
        }
        await washerService.deleteById(washerId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerFindQueryDTO.safeParse(query);
        const { data, total } = await washerService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasher>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerFindQueryDTO.safeParse(query);
        const { data, total } = await washerService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasher>);
    },

    getById: async (req: Request, res: Response) => {
        const { washerId } = req.params;
        if (!washerId) {
            throwInvalidRequestParam('WasherID is required');
        }
        const washer = await washerService.getById(washerId);
        res.status(200).json({
            status: 'ok',
            data: washer,
        } as TResponse<TWasher>);
    },

    getByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const washer = await washerService.getByUserId(userId);
        res.status(200).json({
            status: 'ok',
            data: washer,
        } as TResponse<TWasher>);
    },

    updateById: async (req: Request, res: Response) => {
        const { washerId } = req.params;
        if (!washerId) {
            throwInvalidRequestParam('WasherID is required');
        }
        const parsed = washerUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washer = await washerService.updateById(washerId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: washer,
        } as TResponse<TWasher>);
    },
};
