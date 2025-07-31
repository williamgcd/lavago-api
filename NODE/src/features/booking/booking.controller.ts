import { Request, Response } from 'express';
import { PAGINATION } from '@/constants/pagination';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';

import { bookingCreateDTO, bookingFindQueryDTO, bookingUpdateDTO } from "./booking.controller.dto";
import { bookingService } from "./booking.service";
import { TBooking } from './booking.schema';

export const bookingController = {
    create: async (req: Request, res: Response) => {
        const parsed = bookingCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const booking = await bookingService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: booking,
        } as TResponse<TBooking>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { bookingId } = req.params;
        if (!bookingId) {
            throwInvalidRequestParam('Booking ID is required');
        }
        await bookingService.deleteById(bookingId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = bookingFindQueryDTO.safeParse(query);
        const { data, total } = await bookingService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TBooking>);
    },

    findByClientId: async (req: Request, res: Response) => {
        const { clientId } = req.params;
        if (!clientId) {
            throwInvalidRequestParam('Client ID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = bookingFindQueryDTO.omit({ clientId: true }).safeParse(query);
        const { data, total } = await bookingService.findByClientId(clientId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TBooking>);
    },

    findByWasherId: async (req: Request, res: Response) => {
        const { washerId } = req.params;
        if (!washerId) {
            throwInvalidRequestParam('Washer ID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = bookingFindQueryDTO.omit({ washerId: true }).safeParse(query);
        const { data, total } = await bookingService.findByWasherId(washerId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TBooking>);
    },

    getById: async (req: Request, res: Response) => {
        const { bookingId } = req.params;
        if (!bookingId) {
            throwInvalidRequestParam('Booking ID is required');
        }
        const booking = await bookingService.getById(bookingId);
        res.status(200).json({ status: 'ok', data: booking } as TResponse<TBooking>);
    },

    updateById: async (req: Request, res: Response) => {
        const { bookingId } = req.params;
        if (!bookingId) {
            throwInvalidRequestParam('Booking ID is required');
        }
        const parsed = bookingUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const booking = await bookingService.updateById(bookingId, parsed.data);
        res.status(200).json({ status: 'ok', data: booking } as TResponse<TBooking>);
    },
};
