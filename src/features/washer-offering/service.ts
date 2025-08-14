import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a washer offering record
     * @param values - The washer offering values to create
     * @returns The created washer offering record
     */
    create: async (values: t.TWasherOfferingDtoCreate) => {
        const created = await repo.create(values);
        emitter('washer-offering.created', { id: created.id });
        return created;
    },

    /**
     * Delete a washer offering record
     * @param id - The id of the washer offering record to delete
     * @returns void
     */
    delete: async (id: t.TWasherOfferingDto['id']) => {
        const current = await repo.getById(id);
        emitter('washer-offering.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a washer offering record by id
     * @param id - The id of the washer offering record to get
     * @returns The washer offering record
     */
    getById: async (id: t.TWasherOfferingDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List washer offering records
     * @param filters - The filters to apply to the washer offering records
     * @param pagination - The pagination to apply to the washer offering records
     * @returns The washer offering records
     */
    list: async (
        filters: t.TWasherOfferingDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TWasherOfferingDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List washer offering records by offering id
     * @param offering_id - The offering id to filter by
     * @param filters - The filters to apply to the washer offering records
     * @param pagination - The pagination to apply to the washer offering records
     * @returns The washer offering records
     */
    listByOfferingId: async (
        offering_id: t.TWasherOfferingDtoFilter['offering_id'],
        filters: t.TWasherOfferingDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TWasherOfferingDto[] }> => {
        filters.offering_id = offering_id;
        return repo.list(filters, pagination);
    },

    /**
     * List washer offering records by washer id
     * @param washer_id - The washer id to filter by
     * @param filters - The filters to apply to the washer offering record
     * @param pagination - The pagination to apply to the washer offering record
     * @returns The washer offering records
     */
    listByWasherId: async (
        washer_id: t.TWasherOfferingDtoFilter['washer_id'],
        filters: t.TWasherOfferingDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TWasherOfferingDto[] }> => {
        filters.washer_id = washer_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a washer offering record
     * @param id - The id of the washer offering record to update
     * @param values - The washer offering values to update
     * @returns The updated washer offering record
     */
    update: async (
        id: t.TWasherOfferingDto['id'],
        values: t.TWasherOfferingDtoUpdate
    ) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('washer-offering.updated', {
            id: current.id,
            current,
            updated,
        });
        return updated;
    },
};

export { serv, serv as washerOfferingService };
export default serv;
