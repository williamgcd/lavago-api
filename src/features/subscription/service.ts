import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a subscription record with event emission
     * @param values - The subscription values to create
     * @returns The created subscription record
     * @throws Error if validation fails
     */
    create: async (values: t.TSubscriptionDtoCreate) => {
        const created = await repo.create(values);
        emitter('subscription.created', { id: created.id });
        return created;
    },

    /**
     * Delete a subscription record with event emission
     * @param id - The ID of the subscription record to delete
     * @returns Promise that resolves to void
     * @throws Error if subscription not found
     */
    delete: async (id: t.TSubscriptionDto['id']) => {
        const current = await repo.getById(id);
        emitter('subscription.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a subscription record by ID
     * @param id - The ID of the subscription record to get
     * @returns The subscription record
     * @throws Error if subscription not found or inactive
     */
    getById: async (id: t.TSubscriptionDto['id']) => {
        return repo.getById(id);
    },

    /**
     * Get subscription records by plan ID
     * @param planId - The plan ID to filter subscriptions
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of subscription records
     * @throws Error if database query fails
     */
    getByPlanId: async (
        planId: t.TSubscriptionDto['plan_id'],
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TSubscriptionDto[] }> => {
        return repo.getByPlanId(planId, pagination);
    },

    /**
     * Get subscription records by user ID
     * @param userId - The user ID to filter subscriptions
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of subscription records
     * @throws Error if database query fails
     */
    getByUserId: async (
        userId: t.TSubscriptionDto['user_id'],
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TSubscriptionDto[] }> => {
        return repo.getByUserId(userId, pagination);
    },

    /**
     * List subscription records with filtering and pagination
     * @param filters - The filters to apply to the subscription records
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of subscription records
     * @throws Error if database query fails
     */
    list: async (
        filters: t.TSubscriptionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TSubscriptionDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List active subscription records with filtering and pagination
     * @param filters - The filters to apply to the subscription records
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of active subscription records
     * @throws Error if database query fails
     */
    listActive: async (
        filters: t.TSubscriptionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TSubscriptionDto[] }> => {
        const activeFilters = { ...filters, is_active: true, status: 'active' as const };
        return repo.list(activeFilters, pagination);
    },

    /**
     * Update a subscription record with event emission
     * @param id - The ID of the subscription record to update
     * @param values - The subscription values to update
     * @returns The updated subscription record
     * @throws Error if subscription not found or validation fails
     */
    update: async (id: t.TSubscriptionDto['id'], values: t.TSubscriptionDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('subscription.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as subscriptionService };
export default serv;
