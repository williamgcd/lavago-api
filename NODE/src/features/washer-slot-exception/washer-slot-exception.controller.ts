import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { washerSlotExceptionCreateDTO, washerSlotExceptionFindQueryDTO, washerSlotExceptionUpdateDTO } from "./washer-slot-exception.controller.dto";
import { washerSlotExceptionService } from "./washer-slot-exception.service";
import { TWasherSlotException } from "./washer-slot-exception.schema";

export const washerSlotExceptionController = {
    create: async (req: Request, res: Response) => {
        const parsed = washerSlotExceptionCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washerSlotException = await washerSlotExceptionService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: washerSlotException,
        } as TResponse<TWasherSlotException>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { washerSlotExceptionId } = req.params;
        if (!washerSlotExceptionId) {
            throwInvalidRequestParam('WasherSlotExceptionID is required');
        }
        await washerSlotExceptionService.deleteById(washerSlotExceptionId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerSlotExceptionFindQueryDTO.safeParse(query);
        const { data, total } = await washerSlotExceptionService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherSlotException>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerSlotExceptionFindQueryDTO.safeParse(query);
        const { data, total } = await washerSlotExceptionService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherSlotException>);
    },

    getById: async (req: Request, res: Response) => {
        const { washerSlotExceptionId } = req.params;
        if (!washerSlotExceptionId) {
            throwInvalidRequestParam('WasherSlotExceptionID is required');
        }
        const washerSlotException = await washerSlotExceptionService.getById(washerSlotExceptionId);
        res.status(200).json({
            status: 'ok',
            data: washerSlotException,
        } as TResponse<TWasherSlotException>);
    },

    updateById: async (req: Request, res: Response) => {
        const { washerSlotExceptionId } = req.params;
        if (!washerSlotExceptionId) {
            throwInvalidRequestParam('WasherSlotExceptionID is required');
        }
        const parsed = washerSlotExceptionUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washerSlotException = await washerSlotExceptionService.updateById(washerSlotExceptionId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: washerSlotException,
        } as TResponse<TWasherSlotException>);
    },
};
