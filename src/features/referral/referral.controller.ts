import { Request, Response } from 'express';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';
import { PAGINATION } from '@/constants/pagination';

import { referralCreateDTO, referralFindQueryDTO, referralUpdateDTO } from "./referral.controller.dto";
import { referralService } from "./referral.service";
import { TReferral } from './referral.schema';

export const referralController = {
    create: async (req: Request, res: Response) => {
        const parsed = referralCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }

        const referral = await referralService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: referral,
        } as TResponse<TReferral>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { referralId } = req.params;
        if (!referralId) {
            throwInvalidRequestParam('ReferralID is required');
        }
        await referralService.deleteById(referralId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = referralFindQueryDTO.safeParse(query);
        const { data, total } = await referralService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TReferral>);
    },

    findByReferrerUserId: async (req: Request, res: Response) => {
        const { referrerUserId } = req.params;
        if (!referrerUserId) {
            throwInvalidRequestParam('ReferrerUserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = referralFindQueryDTO.safeParse(query);
        const { data, total } = await referralService.findByReferrerUserId(referrerUserId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TReferral>);
    },

    findByReferredUserId: async (req: Request, res: Response) => {
        const { referredUserId } = req.params;
        if (!referredUserId) {
            throwInvalidRequestParam('ReferredUserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = referralFindQueryDTO.safeParse(query);
        const { data, total } = await referralService.findByReferredUserId(referredUserId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TReferral>);
    },

    getById: async (req: Request, res: Response) => {
        const { referralId } = req.params;
        if (!referralId) {
            throwInvalidRequestParam('ReferralID is required');
        }
        const referral = await referralService.getById(referralId);
        res.status(200).json({ status: 'ok', data: referral } as TResponse<TReferral>);
    },

    updateById: async (req: Request, res: Response) => {
        const { referralId } = req.params;
        if (!referralId) {
            throwInvalidRequestParam('ReferralID is required');
        }

        const parsed = referralUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }

        const referral = await referralService.updateById(referralId, parsed.data);
        res.status(200).json({ status: 'ok', data: referral } as TResponse<TReferral>);
    },
};
