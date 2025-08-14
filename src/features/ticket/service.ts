import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a ticket record
     * @param values - The ticket values to create
     * @returns The created ticket record
     */
    create: async (values: t.TTicketDtoCreate) => {
        const created = await repo.create(values);
        emitter('ticket.created', { id: created.id });
        return created;
    },

    /**
     * Delete a ticket record
     * @param id - The id of the ticket record to delete
     * @returns void
     */
    delete: async (id: t.TTicketDto['id']) => {
        const current = await repo.getById(id);
        emitter('ticket.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a ticket record by id
     * @param id - The id of the ticket record to get
     * @returns The ticket record
     */
    getById: async (id: t.TTicketDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List ticket records
     * @param filters - The filters to apply to the ticket records
     * @param pagination - The pagination to apply to the ticket records
     * @returns The ticket records
     */
    list: async (
        filters: t.TTicketDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TTicketDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List ticket records by assigned user id
     * @param assigned_to - The assigned user id to filter by
     * @param filters - The filters to apply to the ticket records
     * @param pagination - The pagination to apply to the ticket records
     * @returns The ticket records
     */
    listByAssignedTo: async (
        assigned_to: t.TTicketDtoFilter['assigned_to'],
        filters: t.TTicketDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TTicketDto[] }> => {
        filters.assigned_to = assigned_to;
        return repo.list(filters, pagination);
    },

    /**
     * List ticket records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the ticket records
     * @param pagination - The pagination to apply to the ticket records
     * @returns The ticket records
     */
    listByUserId: async (
        user_id: t.TTicketDtoFilter['user_id'],
        filters: t.TTicketDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TTicketDto[] }> => {
        filters.user_id = user_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a ticket record
     * @param id - The id of the ticket record to update
     * @param values - The ticket values to update
     * @returns The updated ticket record
     */
    update: async (id: t.TTicketDto['id'], values: t.TTicketDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('ticket.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as ticketService };
export default serv;
