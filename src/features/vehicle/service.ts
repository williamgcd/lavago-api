import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a vehicle record
     * @param values - The vehicle values to create
     * @returns The created vehicle record
     */
    create: async (values: t.TVehicleDtoCreate) => {
        const created = await repo.create(values);
        emitter('vehicle.created', { id: created.id });
        return created;
    },

    /**
     * Delete a vehicle record
     * @param id - The id of the vehicle record to delete
     * @returns void
     */
    delete: async (id: t.TVehicleDto['id']) => {
        const current = await repo.getById(id);
        emitter('vehicle.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a vehicle record by id
     * @param id - The id of the vehicle record to get
     * @returns The vehicle record
     */
    getById: async (id: t.TVehicleDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List vehicle records
     * @param filters - The filters to apply to the vehicle records
     * @param pagination - The pagination to apply to the vehicle records
     * @returns The vehicle records
     */
    list: async (
        filters: t.TVehicleDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TVehicleDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List vehicle records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the vehicle records
     * @param pagination - The pagination to apply to the vehicle records
     * @returns The vehicle records
     */
    listByUserId: async (
        user_id: t.TVehicleDtoFilter['user_id'],
        filters: t.TVehicleDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TVehicleDto[] }> => {
        filters.user_id = user_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a vehicle record
     * @param id - The id of the vehicle record to update
     * @param values - The vehicle values to update
     * @returns The updated vehicle record
     */
    update: async (id: t.TVehicleDto['id'], values: t.TVehicleDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('vehicle.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as vehicleService };
export default serv;
