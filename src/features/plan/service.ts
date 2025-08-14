import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a plan record with event emission
     * @param values - The plan values to create
     * @returns The created plan record
     * @throws Error if validation fails or plan with same code exists
     */
    create: async (values: t.TPlanDtoCreate) => {
        const created = await repo.create(values);
        emitter('plan.created', { id: created.id });
        return created;
    },

    /**
     * Delete a plan record with event emission
     * @param id - The ID of the plan record to delete
     * @returns Promise that resolves to void
     * @throws Error if plan not found
     */
    delete: async (id: t.TPlanDto['id']) => {
        const current = await repo.getById(id);
        emitter('plan.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a plan record by ID
     * @param id - The ID of the plan record to get
     * @returns The plan record
     * @throws Error if plan not found or inactive
     */
    getById: async (id: t.TPlanDto['id']) => {
        return repo.getById(id);
    },

    /**
     * Get a plan record by code
     * @param code - The code of the plan record to get
     * @returns The plan record
     * @throws Error if plan not found or inactive
     */
    getByCode: async (code: t.TPlanDto['code']) => {
        return repo.getByCode(code);
    },

    /**
     * List plan records with filtering and pagination
     * @param filters - The filters to apply to the plan records
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of plan records
     * @throws Error if database query fails
     */
    list: async (
        filters: t.TPlanDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPlanDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List available plan records (is_available = true) with filtering and pagination
     * @param filters - The filters to apply to the plan records
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of available plan records
     * @throws Error if database query fails
     */
    listAvailable: async (
        filters: t.TPlanDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPlanDto[] }> => {
        const availableFilters = { ...filters, is_available: true };
        return repo.list(availableFilters, pagination);
    },

    /**
     * Update a plan record with event emission
     * @param id - The ID of the plan record to update
     * @param values - The plan values to update
     * @returns The updated plan record
     * @throws Error if plan not found or validation fails
     */
    update: async (id: t.TPlanDto['id'], values: t.TPlanDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('plan.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as planService };
export default serv;
