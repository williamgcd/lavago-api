import { ZodObject } from 'zod';

import {
    throwRecordDeleted,
    throwRecordExists,
    throwRecordInactive,
    throwRecordMissing,
} from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('subscriptions');

const repo = {
    /**
     * Parse and validate data against a Zod schema
     * @param data - The data to validate
     * @param schema - The Zod schema to validate against
     * @returns The parsed and validated data
     * @throws Error if validation fails
     */
    parse: async (
        data: Partial<t.TSubscriptionDto>,
        schema: ZodObject<any>
    ) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('subscription.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new subscription record
     * @param values - The subscription values to create
     * @returns The created subscription record
     * @throws Error if validation fails
     */
    create: async (
        values: Partial<t.TSubscriptionDto>
    ): Promise<t.TSubscriptionDto> => {
        const data = { ...values } as Partial<t.TSubscriptionDto>;
        await repo.parse(data, d.SubscriptionDtoCreate);

        try {
            // Add record to the database
            const created = await db.create(data);
            return d.SubscriptionDto.parse(created);
        } catch (err) {
            console.error('subscription.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a subscription record (soft delete by default)
     * @param id - The ID of the subscription record to delete
     * @param existing - The existing subscription record (optional, will fetch if not provided)
     * @param hard - Whether to perform hard delete (default: false)
     * @returns Promise that resolves to void
     * @throws Error if subscription not found
     */
    delete: async (
        id: t.TSubscriptionDto['id'],
        existing?: t.TSubscriptionDto,
        hard: boolean = false
    ): Promise<void> => {
        try {
            let record = existing;
            if (!existing) {
                record = await repo.getById(id);
            }
            // Delete record from the database
            if (hard === true) {
                await db.deleteHard(record.id);
                return;
            }
            await db.deleteSoft(record.id);
        } catch (err) {
            console.error('subscription.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a subscription record by ID
     * @param value - The ID of the subscription record to get
     * @returns The subscription record
     * @throws Error if subscription not found or inactive
     */
    getById: async (
        value: t.TSubscriptionDto['id']
    ): Promise<t.TSubscriptionDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                is_active: { op: 'eq', value: true },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Subscription');
            }
            return d.SubscriptionDto.parse(data);
        } catch (err) {
            console.error('subscription.repo.getById', err);
            throw err;
        }
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
        try {
            const where = {
                plan_id: { op: 'eq', value: planId },
                deleted_at: { op: 'is', value: null },
            };

            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.SubscriptionDto.parse(r)) };
        } catch (err) {
            console.error('subscription.repo.getByPlanId', err);
            throw err;
        }
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
        try {
            const where = {
                user_id: { op: 'eq', value: userId },
                deleted_at: { op: 'is', value: null },
            };

            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.SubscriptionDto.parse(r)) };
        } catch (err) {
            console.error('subscription.repo.getByUserId', err);
            throw err;
        }
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
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        if (filters.plan_id) {
            const value = filters.plan_id;
            where.plan_id = { op: 'eq', value };
        }
        if (filters.user_id) {
            const value = filters.user_id;
            where.user_id = { op: 'eq', value };
        }
        if (filters.is_active !== undefined) {
            const value = filters.is_active;
            where.is_active = { op: 'eq', value };
        }
        if (filters.is_automated !== undefined) {
            const value = filters.is_automated;
            where.is_automated = { op: 'eq', value };
        }
        if (filters.status) {
            const value = filters.status;
            where.status = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.SubscriptionDto.parse(r)) };
        } catch (err) {
            console.error('subscription.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a subscription record
     * @param id - The ID of the subscription record to update
     * @param values - The subscription values to update
     * @param existing - The existing subscription record (optional, will fetch if not provided)
     * @returns The updated subscription record
     * @throws Error if subscription not found or validation fails
     */
    update: async (
        id: t.TSubscriptionDto['id'],
        values: Partial<t.TSubscriptionDto>,
        existing?: t.TSubscriptionDto
    ): Promise<t.TSubscriptionDto> => {
        const data = { ...values } as Partial<t.TSubscriptionDto>;
        await repo.parse(values, d.SubscriptionDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database
            const updated = await db.update(id, data);
            return d.SubscriptionDto.parse(updated);
        } catch (err) {
            console.error('subscription.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as subscriptionRepository };
export default repo;
