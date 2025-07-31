import { Request, Response } from 'express';
import { PAGINATION } from '@/constants/pagination';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';

import { subscriptionCreateDTO, subscriptionFindQueryDTO, subscriptionGetByUserIdDTO, subscriptionUpdateDTO } from "./subscription.controller.dto";
import { subscriptionService } from "./subscription.service";
import { TSubscription } from './subscription.schema';

export const subscriptionController = {
    create: async (req: Request, res: Response) => {
        const parsed = subscriptionCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const subscription = await subscriptionService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: subscription,
        } as TResponse<TSubscription>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throwInvalidRequestParam('Subscription ID is required');
        }
        await subscriptionService.deleteById(id);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = subscriptionFindQueryDTO.safeParse(query);
        const { data, total } = await subscriptionService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TSubscription>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('User ID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = subscriptionFindQueryDTO.omit({ userId: true }).safeParse(query);
        const { data, total } = await subscriptionService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TSubscription>);
    },

    findByProductId: async (req: Request, res: Response) => {
        const { productId } = req.params;
        if (!productId) {
            throwInvalidRequestParam('Product ID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = subscriptionFindQueryDTO.omit({ productId: true }).safeParse(query);
        const { data, total } = await subscriptionService.findByProductId(productId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TSubscription>);
    },

    getById: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throwInvalidRequestParam('Subscription ID is required');
        }
        const subscription = await subscriptionService.getById(id);
        res.status(200).json({ status: 'ok', data: subscription } as TResponse<TSubscription>);
    },

    updateById: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throwInvalidRequestParam('Subscription ID is required');
        }
        const parsed = subscriptionUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const subscription = await subscriptionService.updateById(id, parsed.data);
        res.status(200).json({ status: 'ok', data: subscription } as TResponse<TSubscription>);
    },
};
