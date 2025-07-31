import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { chatUserCreateDTO, chatUserFindQueryDTO, chatUserUpdateDTO } from "./chat-user.controller.dto";
import { chatUserService } from "./chat-user.service";
import { TChatUser } from "./chat-user.schema";

export const chatUserController = {
    create: async (req: Request, res: Response) => {
        const parsed = chatUserCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const chatUser = await chatUserService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: chatUser,
        } as TResponse<TChatUser>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { chatUserId } = req.params;
        if (!chatUserId) {
            throwInvalidRequestParam('ChatUserID is required');
        }
        await chatUserService.deleteById(chatUserId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = chatUserFindQueryDTO.safeParse(query);
        const { data, total } = await chatUserService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TChatUser>);
    },

    findByChatId: async (req: Request, res: Response) => {
        const { chatId } = req.params;
        if (!chatId) {
            throwInvalidRequestParam('ChatID is required');
        }
        const { data: chatUsers } = await chatUserService.findByChatId(chatId);
        res.status(200).json({
            status: 'ok',
            data: chatUsers,
        } as TResponse<TChatUser[]>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { data: chatUsers } = await chatUserService.findByUserId(userId);
        res.status(200).json({
            status: 'ok',
            data: chatUsers,
        } as TResponse<TChatUser[]>);
    },

    getById: async (req: Request, res: Response) => {
        const { chatUserId } = req.params;
        if (!chatUserId) {
            throwInvalidRequestParam('ChatUserID is required');
        }
        const chatUser = await chatUserService.getById(chatUserId);
        res.status(200).json({
            status: 'ok',
            data: chatUser,
        } as TResponse<TChatUser>);
    },

    getByChatIdAndUserId: async (req: Request, res: Response) => {
        const { chatId, userId } = req.params;
        if (!chatId) {
            throwInvalidRequestParam('ChatID is required');
        }
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const chatUser = await chatUserService.getByChatIdAndUserId(chatId, userId);
        res.status(200).json({
            status: 'ok',
            data: chatUser,
        } as TResponse<TChatUser>);
    },

    updateById: async (req: Request, res: Response) => {
        const { chatUserId } = req.params;
        if (!chatUserId) {
            throwInvalidRequestParam('ChatUserID is required');
        }
        const parsed = chatUserUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const chatUser = await chatUserService.updateById(chatUserId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: chatUser,
        } as TResponse<TChatUser>);
    },
};
