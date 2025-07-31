import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { washerSlotCreateDTO, washerSlotFindQueryDTO, washerSlotUpdateDTO } from "./washer-slot.controller.dto";
import { washerSlotService } from "./washer-slot.service";
import { TWasherSlot } from "./washer-slot.schema";

export const washerSlotController = {
    create: async (req: Request, res: Response) => {
        const parsed = washerSlotCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washerSlot = await washerSlotService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: washerSlot,
        } as TResponse<TWasherSlot>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { washerSlotId } = req.params;
        if (!washerSlotId) {
            throwInvalidRequestParam('WasherSlotID is required');
        }
        await washerSlotService.deleteById(washerSlotId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerSlotFindQueryDTO.safeParse(query);
        const { data, total } = await washerSlotService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherSlot>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerSlotFindQueryDTO.safeParse(query);
        const { data, total } = await washerSlotService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherSlot>);
    },

    getById: async (req: Request, res: Response) => {
        const { washerSlotId } = req.params;
        if (!washerSlotId) {
            throwInvalidRequestParam('WasherSlotID is required');
        }
        const washerSlot = await washerSlotService.getById(washerSlotId);
        res.status(200).json({
            status: 'ok',
            data: washerSlot,
        } as TResponse<TWasherSlot>);
    },

    updateById: async (req: Request, res: Response) => {
        const { washerSlotId } = req.params;
        if (!washerSlotId) {
            throwInvalidRequestParam('WasherSlotID is required');
        }
        const parsed = washerSlotUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washerSlot = await washerSlotService.updateById(washerSlotId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: washerSlot,
        } as TResponse<TWasherSlot>);
    },
};
