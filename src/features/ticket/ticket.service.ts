import { PAGINATION } from "@/constants";
import { TTicketFindQueryDTO } from "./ticket.controller.dto";
import { ticketRepository } from "./ticket.repository";
import { TTicket } from "./ticket.schema";
import { eventBus } from "@/libs/event-bus-client";
import { TTicketEvents } from "./ticket.events";

export const ticketService = {
    create: async (data: Omit<Partial<TTicket>, 'id'>): Promise<TTicket> => {
        const ticket = await ticketRepository.create(data);
        eventBus.emit<TTicketEvents['ticket.created']>('ticket.created', ticket);
        return ticket;
    },

    deleteById: async (id: string): Promise<void> => {
        const ticket = await ticketRepository.getById(id);
        await ticketRepository.deleteById(id);
        eventBus.emit<TTicketEvents['ticket.deleted']>('ticket.deleted', { id, userId: ticket.userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TTicketFindQueryDTO,
    ): Promise<{ data: TTicket[], total: number }> => {
        return ticketRepository.find(limit, page, query);
    },

    findByAssignedTo: async (
        assignedTo: string,
        limit?: number,
        page?: number,
        query?: Omit<TTicketFindQueryDTO, 'assignedTo'>
    ): Promise<{ data: TTicket[], total: number }> => {
        return ticketRepository.find(limit, page, { assignedTo, ...query });
    },

    findByObject: async (
        object: string,
        objectId: string,
    ): Promise<{ data: TTicket[], total: number }> => {
        const limit = PAGINATION.DEFAULT_LIMIT_MAX;
        return ticketRepository.find(limit, 1, { object, objectId });
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
        query?: Omit<TTicketFindQueryDTO, 'userId'>
    ): Promise<{ data: TTicket[], total: number }> => {
        return ticketRepository.find(limit, page, { userId, ...query });
    },

    getById: async (id: string): Promise<TTicket> => {
        return ticketRepository.getById(id);
    },

    updateAssignedToById: async (id: string, assignedTo: string): Promise<TTicket> => {
        const ticket = await ticketRepository.updateById(id, { assignedTo });
        eventBus.emit<TTicketEvents['ticket.updated.assignedTo']>('ticket.updated.assignedTo', { id, assignedTo });
        return ticket;
    },

    updateById: async (id: string, data: Partial<TTicket>): Promise<TTicket> => {
        const prev = await ticketRepository.getById(id);
        const next = await ticketRepository.updateById(id, data);
        eventBus.emit<TTicketEvents['ticket.updated']>('ticket.updated', { prev, next });
        return next;
    },
};
