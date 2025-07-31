import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { chatCreateDTO, chatFindQueryDTO, chatUpdateDTO } from "./chat.controller.dto";
import { chatService } from "./chat.service";
import { TChat } from "./chat.schema";

export const chatController = {
    create: async (req: Request, res: Response) => {
        const parsed = chatCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const chat = await chatService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: chat,
        } as TResponse<TChat>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { chatId } = req.params;
        if (!chatId) {
            throwInvalidRequestParam('ChatID is required');
        }
        await chatService.deleteById(chatId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = chatFindQueryDTO.safeParse(query);
        const { data, total } = await chatService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TChat>);
    },

    getById: async (req: Request, res: Response) => {
        const { chatId } = req.params;
        if (!chatId) {
            throwInvalidRequestParam('ChatID is required');
        }
        const chat = await chatService.getById(chatId);
        res.status(200).json({
            status: 'ok',
            data: chat,
        } as TResponse<TChat>);
    },

    getByObjectAndObjectId: async (req: Request, res: Response) => {
        const { object, objectId } = req.params;
        if (!object) {
            throwInvalidRequestParam('Object is required');
        }
        if (!objectId) {
            throwInvalidRequestParam('ObjectID is required');
        }
        const chat = await chatService.getByObjectAndObjectId(object, objectId);
        res.status(200).json({
            status: 'ok',
            data: chat,
        } as TResponse<TChat>);
    },

    updateById: async (req: Request, res: Response) => {
        const { chatId } = req.params;
        if (!chatId) {
            throwInvalidRequestParam('ChatID is required');
        }
        const parsed = chatUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const chat = await chatService.updateById(chatId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: chat,
        } as TResponse<TChat>);
    },
};
