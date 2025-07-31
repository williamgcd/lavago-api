import { Request, Response } from 'express';
import { PAGINATION } from '@/constants/pagination';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';

import { userCreateDTO, userFindQueryDTO, userGetByEmailDTO, userGetByPhoneDTO, userOtpCheckDTO, userUpdateDTO } from "./user.controller.dto";
import { userService } from "./user.service";
import { TUser } from './user.schema';

export const userController = {
    create: async (req: Request, res: Response) => {
        const parsed = userCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const user = await userService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: user,
        } as TResponse<TUser>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        await userService.deleteById(userId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = userFindQueryDTO.safeParse(query);
        const { data, total } = await userService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TUser>);
    },

    getById: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const user = await userService.getById(userId);
        res.status(200).json({ status: 'ok', data: user } as TResponse<TUser>);
    },
    
    getByEmail: async (req: Request, res: Response) => {
        const parsed = userGetByEmailDTO.safeParse(req.params);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const user = await userService.getByEmail(parsed.data.email);
        res.status(200).json({ status: 'ok', data: user } as TResponse<TUser>);
    },

    getByPhone: async (req: Request, res: Response) => {
        const parsed = userGetByPhoneDTO.safeParse(req.params);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const user = await userService.getByPhone(parsed.data.phone);
        res.status(200).json({ status: 'ok', data: user } as TResponse<TUser>);
    },

    otpCheck: async (req: Request, res: Response) => {
        const parsed = userOtpCheckDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const isValid = await userService.otpCheck(parsed.data.phone, parsed.data.phoneOtp);
    },

    otpUpdateByPhone: async (req: Request, res: Response) => {
        const { phone } = req.params;
        if (!phone) {
            throwInvalidRequestParam('Phone is required');
        }
        const user = await userService.otpUpdateByPhone(phone);
        res.status(200).json({ status: 'ok', data: user } as TResponse<TUser>);
    },

    updateById: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const parsed = userUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const user = await userService.updateById(userId, parsed.data);
        res.status(200).json({ status: 'ok', data: user } as TResponse<TUser>);
    },
};