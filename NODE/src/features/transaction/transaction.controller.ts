import { Request, Response } from 'express';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';
import { PAGINATION } from '@/constants/pagination';

import { transactionCreateDTO, transactionFindQueryDTO, transactionUpdateDTO } from "./transaction.controller.dto";
import { transactionService } from "./transaction.service";
import { TTransaction } from './transaction.schema';

export const transactionController = {
    create: async (req: Request, res: Response) => {
        const parsed = transactionCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }

        const transaction = await transactionService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: transaction,
        } as TResponse<TTransaction>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { transactionId } = req.params;
        if (!transactionId) {
            throwInvalidRequestParam('TransactionID is required');
        }
        await transactionService.deleteById(transactionId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = transactionFindQueryDTO.safeParse(query);
        const { data, total } = await transactionService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TTransaction>);
    },

    findByObject: async (req: Request, res: Response) => {
        const { object, objectId } = req.params;
        if (!object || !objectId) {
            throwInvalidRequestParam('Object and ObjectID are required');
        }
        const { data } = await transactionService.findByObject(object, objectId);

        res.status(200).json({
            status: 'ok',
            data,
        } as TResponse<TTransaction[]>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = transactionFindQueryDTO.safeParse(query);
        const { data, total } = await transactionService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TTransaction>);
    },

    getById: async (req: Request, res: Response) => {
        const { transactionId } = req.params;
        if (!transactionId) {
            throwInvalidRequestParam('TransactionID is required');
        }
        const transaction = await transactionService.getById(transactionId);
        res.status(200).json({ status: 'ok', data: transaction } as TResponse<TTransaction>);
    },

    updateById: async (req: Request, res: Response) => {
        const { transactionId } = req.params;
        if (!transactionId) {
            throwInvalidRequestParam('TransactionID is required');
        }

        const parsed = transactionUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }

        const transaction = await transactionService.updateById(transactionId, parsed.data);
        res.status(200).json({ status: 'ok', data: transaction } as TResponse<TTransaction>);
    },
};
