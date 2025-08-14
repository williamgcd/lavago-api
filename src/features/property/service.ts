import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a property record
     * @param values - The property values to create
     * @returns The created property record
     */
    create: async (values: t.TPropertyDtoCreate) => {
        const created = await repo.create(values);
        emitter('property.created', { id: created.id });
        return created;
    },

    /**
     * Delete a property record
     * @param id - The id of the property record to delete
     * @returns void
     */
    delete: async (id: t.TPropertyDto['id']) => {
        const current = await repo.getById(id);
        emitter('property.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a property record by id
     * @param id - The id of the property record to get
     * @returns The property record
     */
    getById: async (id: t.TPropertyDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List property records
     * @param filters - The filters to apply to the property records
     * @param pagination - The pagination to apply to the property records
     * @returns The property records
     */
    list: async (
        filters: t.TPropertyDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPropertyDto[] }> => {
        return repo.list(filters, pagination);
    },

    listByZipCode: async (
        zip_code: t.TPropertyDtoFilter['zip_code'],
        filters: t.TPropertyDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPropertyDto[] }> => {
        filters.zip_code = zip_code;
        return repo.list(filters, pagination);
    },

    /**
     * Update a property record
     * @param id - The id of the property record to update
     * @param values - The property values to update
     * @returns The updated property record
     */
    update: async (id: t.TPropertyDto['id'], values: t.TPropertyDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('property.updated', {
            id: current.id,
            current,
            updated,
        });
        return updated;
    },
};

export { serv, serv as propertyService };
export default serv;
