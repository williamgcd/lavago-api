import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a washer record
     * @param values - The washer values to create
     * @returns The created washer record
     */
    create: async (values: t.TWasherDtoCreate) => {
        const created = await repo.create(values);
        emitter('washer.created', { id: created.id });
        return created;
    },

    /**
     * Delete a washer record
     * @param id - The id of the washer record to delete
     * @returns void
     */
    delete: async (id: t.TWasherDto['id']) => {
        const current = await repo.getById(id);
        emitter('washer.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a washer record by id
     * @param id - The id of the washer record to get
     * @returns The washer record
     */
    getById: async (id: t.TWasherDto['id']) => {
        return repo.getById(id);
    },

    /**
     * Get a washer record by user_id
     * @param user_id - The user_id of the washer record to get
     * @returns The washer record
     */
    getByUserId: async (user_id: t.TWasherDto['user_id']) => {
        return repo.getByUserId(user_id);
    },

    /**
     * List washer records
     * @param filters - The filters to apply to the washer records
     * @param pagination - The pagination to apply to the washer records
     * @returns The washer records
     */
    list: async (
        filters: t.TWasherDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TWasherDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * Update a washer record
     * @param id - The id of the washer record to update
     * @param values - The washer values to update
     * @returns The updated washer record
     */
    update: async (id: t.TWasherDto['id'], values: t.TWasherDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('washer.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as washerService };
export default serv;
