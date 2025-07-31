import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { chatMessageCreateDTO, chatMessageFindQueryDTO, chatMessageUpdateDTO } from "./chat-message.controller.dto";
import { chatMessageService } from "./chat-message.service";
import { TChatMessage } from "./chat-message.schema";

export const chatMessageController = {
    create: async (req: Request, res: Response) => {
        const parsed = chatMessageCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const chatMessage = await chatMessageService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: chatMessage,
        } as TResponse<TChatMessage>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { chatMessageId } = req.params;
        if (!chatMessageId) {
            throwInvalidRequestParam('ChatMessageID is required');
        }
        await chatMessageService.deleteById(chatMessageId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = chatMessageFindQueryDTO.safeParse(query);
        const { data, total } = await chatMessageService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TChatMessage>);
    },

    findByChatId: async (req: Request, res: Response) => {
        const { chatId } = req.params;
        if (!chatId) {
            throwInvalidRequestParam('ChatID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = chatMessageFindQueryDTO.omit({ chatId: true }).safeParse(query);
        const { data, total } = await chatMessageService.findByChatId(chatId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TChatMessage>);
    },

    getById: async (req: Request, res: Response) => {
        const { chatMessageId } = req.params;
        if (!chatMessageId) {
            throwInvalidRequestParam('ChatMessageID is required');
        }
        const chatMessage = await chatMessageService.getById(chatMessageId);
        res.status(200).json({
            status: 'ok',
            data: chatMessage,
        } as TResponse<TChatMessage>);
    },

    updateById: async (req: Request, res: Response) => {
        const { chatMessageId } = req.params;
        if (!chatMessageId) {
            throwInvalidRequestParam('ChatMessageID is required');
        }
        const parsed = chatMessageUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const chatMessage = await chatMessageService.updateById(chatMessageId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: chatMessage,
        } as TResponse<TChatMessage>);
    },
};
