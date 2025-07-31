import { Request, Response } from 'express';
import { PAGINATION } from '@/constants/pagination';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';

import { paymentCreateDTO, paymentFindQueryDTO, paymentUpdateDTO } from "./payment.controller.dto";
import { paymentService } from "./payment.service";
import { TPayment } from './payment.schema';

export const paymentController = {
    create: async (req: Request, res: Response) => {
        const parsed = paymentCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const payment = await paymentService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: payment,
        } as TResponse<TPayment>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        if (!paymentId) {
            throwInvalidRequestParam('Payment ID is required');
        }
        await paymentService.deleteById(paymentId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = paymentFindQueryDTO.safeParse(query);
        const { data, total } = await paymentService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TPayment>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('User ID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = paymentFindQueryDTO.omit({ userId: true }).safeParse(query);
        const { data, total } = await paymentService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TPayment>);
    },

    getById: async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        if (!paymentId) {
            throwInvalidRequestParam('Payment ID is required');
        }
        const payment = await paymentService.getById(paymentId);
        res.status(200).json({ status: 'ok', data: payment } as TResponse<TPayment>);
    },

    getByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('User ID is required');
        }
        const payments = await paymentService.getByUserId(userId);
        res.status(200).json({ status: 'ok', data: payments } as TResponse<TPayment[]>);
    },

    getByProviderId: async (req: Request, res: Response) => {
        const { paymentProviderId } = req.params;
        if (!paymentProviderId) {
            throwInvalidRequestParam('Payment Provider ID is required');
        }
        const payment = await paymentService.getByProviderId(paymentProviderId);
        res.status(200).json({ status: 'ok', data: payment } as TResponse<TPayment>);
    },

    updateById: async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        if (!paymentId) {
            throwInvalidRequestParam('Payment ID is required');
        }
        const parsed = paymentUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const payment = await paymentService.updateById(paymentId, parsed.data);
        res.status(200).json({ status: 'ok', data: payment } as TResponse<TPayment>);
    },

    authorize: async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        if (!paymentId) {
            throwInvalidRequestParam('Payment ID is required');
        }
        const payment = await paymentService.authorize(paymentId);
        res.status(200).json({ status: 'ok', data: payment } as TResponse<TPayment>);
    },

    confirm: async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        if (!paymentId) {
            throwInvalidRequestParam('Payment ID is required');
        }
        const payment = await paymentService.confirm(paymentId);
        res.status(200).json({ status: 'ok', data: payment } as TResponse<TPayment>);
    },

    fail: async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        if (!paymentId) {
            throwInvalidRequestParam('Payment ID is required');
        }
        const payment = await paymentService.fail(paymentId);
        res.status(200).json({ status: 'ok', data: payment } as TResponse<TPayment>);
    },

    refund: async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        if (!paymentId) {
            throwInvalidRequestParam('Payment ID is required');
        }
        const payment = await paymentService.refund(paymentId);
        res.status(200).json({ status: 'ok', data: payment } as TResponse<TPayment>);
    },

    cancel: async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        if (!paymentId) {
            throwInvalidRequestParam('Payment ID is required');
        }
        const payment = await paymentService.cancel(paymentId);
        res.status(200).json({ status: 'ok', data: payment } as TResponse<TPayment>);
    },
};
