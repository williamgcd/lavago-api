import { Request, Response } from 'express';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';
import { PAGINATION } from '@/constants/pagination';

import { walletCreateDTO, walletFindQueryDTO, walletUpdateDTO } from "./wallet.controller.dto";
import { walletService } from "./wallet.service";
import { TWallet } from './wallet.schema';

export const walletController = {
    create: async (req: Request, res: Response) => {
        const parsed = walletCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const wallet = await walletService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: wallet,
        } as TResponse<TWallet>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { walletId } = req.params;
        if (!walletId) {
            throwInvalidRequestParam('WalletID is required');
        }
        await walletService.deleteById(walletId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = walletFindQueryDTO.safeParse(query);
        const { data, total } = await walletService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWallet>);
    },

    getById: async (req: Request, res: Response) => {
        const { walletId } = req.params;
        if (!walletId) {
            throwInvalidRequestParam('WalletID is required');
        }
        const wallet = await walletService.getById(walletId);
        res.status(200).json({ status: 'ok', data: wallet } as TResponse<TWallet>);
    },

    getByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const wallet = await walletService.getByUserId(userId);
        res.status(200).json({ status: 'ok', data: wallet } as TResponse<TWallet>);
    },

    updateById: async (req: Request, res: Response) => {
        const { walletId } = req.params;
        if (!walletId) {
            throwInvalidRequestParam('WalletID is required');
        }
        const parsed = walletUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const wallet = await walletService.updateById(walletId, parsed.data);
        res.status(200).json({ status: 'ok', data: wallet } as TResponse<TWallet>);
    },
};
