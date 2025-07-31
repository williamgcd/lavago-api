import { Request, Response } from 'express';
import { PAGINATION } from '@/constants/pagination';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';

import { bookingActionCreateDTO, bookingActionFindQueryDTO, bookingActionUpdateDTO } from "./booking-action.controller.dto";
import { bookingActionService } from "./booking-action.service";
import { TBookingAction } from './booking-action.schema';

export const bookingActionController = {
    create: async (req: Request, res: Response) => {
        const parsed = bookingActionCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const bookingAction = await bookingActionService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: bookingAction,
        } as TResponse<TBookingAction>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { bookingActionId } = req.params;
        if (!bookingActionId) {
            throwInvalidRequestParam('Booking Action ID is required');
        }
        await bookingActionService.deleteById(bookingActionId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = bookingActionFindQueryDTO.safeParse(query);
        const { data, total } = await bookingActionService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TBookingAction>);
    },

    findByBookingId: async (req: Request, res: Response) => {
        const { bookingId } = req.params;
        if (!bookingId) {
            throwInvalidRequestParam('Booking ID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = bookingActionFindQueryDTO.omit({ bookingId: true }).safeParse(query);
        const { data, total } = await bookingActionService.findByBookingId(bookingId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TBookingAction>);
    },

    getById: async (req: Request, res: Response) => {
        const { bookingActionId } = req.params;
        if (!bookingActionId) {
            throwInvalidRequestParam('Booking Action ID is required');
        }
        const bookingAction = await bookingActionService.getById(bookingActionId);
        res.status(200).json({ status: 'ok', data: bookingAction } as TResponse<TBookingAction>);
    },

    updateById: async (req: Request, res: Response) => {
        const { bookingActionId } = req.params;
        if (!bookingActionId) {
            throwInvalidRequestParam('Booking Action ID is required');
        }
        const parsed = bookingActionUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const bookingAction = await bookingActionService.updateById(bookingActionId, parsed.data);
        res.status(200).json({ status: 'ok', data: bookingAction } as TResponse<TBookingAction>);
    },
};
