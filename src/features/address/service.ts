import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a address record
     * @param values - The address values to create
     * @returns The created address record
     */
    create: async (values: t.TAddressDtoCreate) => {
        const created = await repo.create(values);
        emitter('address.created', { id: created.id });
        return created;
    },

    /**
     * Delete a address record
     * @param id - The id of the address record to delete
     * @returns void
     */
    delete: async (id: t.TAddressDto['id']) => {
        const current = await repo.getById(id);
        emitter('address.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a address record by id
     * @param id - The id of the address record to get
     * @returns The address record
     */
    getById: async (id: t.TAddressDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List address records
     * @param filters - The filters to apply to the address records
     * @param pagination - The pagination to apply to the address records
     * @returns The address records
     */
    list: async (
        filters: t.TAddressDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TAddressDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List address records by property id
     * @param property_id - The property id to filter by
     * @param filters - The filters to apply to the address records
     * @param pagination - The pagination to apply to the address records
     * @returns The address records
     */
    listByPropertyId: async (
        property_id: t.TAddressDtoFilter['property_id'],
        filters: t.TAddressDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TAddressDto[] }> => {
        filters.property_id = property_id;
        return repo.list(filters, pagination);
    },

    /**
     * List address records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the address records
     * @param pagination - The pagination to apply to the address records
     * @returns The address records
     */
    listByUserId: async (
        user_id: t.TAddressDtoFilter['user_id'],
        filters: t.TAddressDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TAddressDto[] }> => {
        filters.user_id = user_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a address record
     * @param id - The id of the address record to update
     * @param values - The address values to update
     * @returns The updated address record
     */
    update: async (id: t.TAddressDto['id'], values: t.TAddressDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('address.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as addressService };
export default serv;
