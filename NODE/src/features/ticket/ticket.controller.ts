import { Request, Response } from 'express';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';
import { PAGINATION } from '@/constants/pagination';

import { ticketCreateDTO, ticketFindQueryDTO, ticketUpdateDTO } from "./ticket.controller.dto";
import { ticketService } from "./ticket.service";
import { TTicket } from './ticket.schema';

export const ticketController = {
    create: async (req: Request, res: Response) => {
        const parsed = ticketCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }

        const ticket = await ticketService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: ticket,
        } as TResponse<TTicket>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { ticketId } = req.params;
        if (!ticketId) {
            throwInvalidRequestParam('TicketID is required');
        }
        await ticketService.deleteById(ticketId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = ticketFindQueryDTO.safeParse(query);
        const { data, total } = await ticketService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TTicket>);
    },

    findByAssignedTo: async (req: Request, res: Response) => {
        const { assignedTo } = req.params;
        if (!assignedTo) {
            throwInvalidRequestParam('AssignedTo is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = ticketFindQueryDTO.safeParse(query);
        const { data, total } = await ticketService.findByAssignedTo(assignedTo, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TTicket>);
    },

    findByObject: async (req: Request, res: Response) => {
        const { object, objectId } = req.params;
        if (!object || !objectId) {
            throwInvalidRequestParam('Object and ObjectID are required');
        }
        const { data } = await ticketService.findByObject(object, objectId);

        res.status(200).json({
            status: 'ok',
            data,
        } as TResponse<TTicket[]>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = ticketFindQueryDTO.safeParse(query);
        const { data, total } = await ticketService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TTicket>);
    },

    getById: async (req: Request, res: Response) => {
        const { ticketId } = req.params;
        if (!ticketId) {
            throwInvalidRequestParam('TicketID is required');
        }
        const ticket = await ticketService.getById(ticketId);
        res.status(200).json({ status: 'ok', data: ticket } as TResponse<TTicket>);
    },

    updateById: async (req: Request, res: Response) => {
        const { ticketId } = req.params;
        if (!ticketId) {
            throwInvalidRequestParam('TicketID is required');
        }

        const parsed = ticketUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }

        const ticket = await ticketService.updateById(ticketId, parsed.data);
        res.status(200).json({ status: 'ok', data: ticket } as TResponse<TTicket>);
    },
};
