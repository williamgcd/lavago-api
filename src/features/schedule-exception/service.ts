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
    create: async (values: t.TScheduleExceptionDtoCreate) => {
        const created = await repo.create(values);
        emitter('schedule.slot.created', { id: created.id });
        return created;
    },

    /**
     * Delete a ticket record
     * @param id - The id of the ticket record to delete
     * @returns void
     */
    delete: async (id: t.TScheduleExceptionDto['id']) => {
        const current = await repo.getById(id);
        emitter('schedule.slot.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a ticket record by id
     * @param id - The id of the ticket record to get
     * @returns The ticket record
     */
    getById: async (id: t.TScheduleExceptionDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List ticket records
     * @param filters - The filters to apply to the ticket records
     * @param pagination - The pagination to apply to the ticket records
     * @returns The ticket records
     */
    list: async (
        filters: t.TScheduleExceptionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TScheduleExceptionDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List ticket records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the ticket records
     * @param pagination - The pagination to apply to the ticket records
     * @returns The ticket records
     */
    listByWasherId: async (
        washer_id: t.TScheduleExceptionDtoFilter['washer_id'],
        filters: t.TScheduleExceptionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TScheduleExceptionDto[] }> => {
        filters.washer_id = washer_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a ticket record
     * @param id - The id of the ticket record to update
     * @param values - The ticket values to update
     * @returns The updated ticket record
     */
    update: async (
        id: t.TScheduleExceptionDto['id'],
        values: t.TScheduleExceptionDtoUpdate
    ) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('schedule.slot.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as ticketService };
export default serv;
