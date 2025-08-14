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

const db = createDbClient('plans');

const repo = {
    /**
     * Parse and validate data against a Zod schema
     * @param data - The data to validate
     * @param schema - The Zod schema to validate against
     * @returns The parsed and validated data
     * @throws Error if validation fails
     */
    parse: async (data: Partial<t.TPlanDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('plan.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new plan record
     * @param values - The plan values to create
     * @returns The created plan record
     * @throws Error if plan with same code already exists
     * @throws Error if validation fails
     */
    create: async (values: Partial<t.TPlanDto>): Promise<t.TPlanDto> => {
        const data = { ...values } as Partial<t.TPlanDto>;
        await repo.parse(data, d.PlanDtoCreate);

        // Check if there is an existing record with the same code
        const exists = await repo.getExisting(data.code);
        if (exists && exists.id) {
            throwRecordExists('Plan');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.PlanDto.parse(created);
        } catch (err) {
            console.error('plan.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a plan record (soft delete by default)
     * @param id - The ID of the plan record to delete
     * @param existing - The existing plan record (optional, will fetch if not provided)
     * @param hard - Whether to perform hard delete (default: false)
     * @returns Promise that resolves to void
     * @throws Error if plan not found
     */
    delete: async (
        id: t.TPlanDto['id'],
        existing?: t.TPlanDto,
        hard: boolean = false
    ): Promise<void> => {
        try {
            let record = existing;
            if (!existing) {
                record = await repo.getById(id);
            }
            // Delete record from the database;
            if (hard === true) {
                await db.deleteHard(record.id);
                return;
            }
            await db.deleteSoft(record.id);
        } catch (err) {
            console.error('plan.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a plan record by ID
     * @param value - The ID of the plan record to get
     * @returns The plan record
     * @throws Error if plan not found or inactive
     */
    getById: async (value: t.TPlanDto['id']): Promise<t.TPlanDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                is_active: { op: 'eq', value: true },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Plan');
            }
            return d.PlanDto.parse(data);
        } catch (err) {
            console.error('plan.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get a plan record by code
     * @param value - The code of the plan record to get
     * @returns The plan record
     * @throws Error if plan not found or inactive
     */
    getByCode: async (value: t.TPlanDto['code']): Promise<t.TPlanDto> => {
        try {
            const data = await db.single({
                code: { op: 'eq', value },
                is_active: { op: 'eq', value: true },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Plan');
            }
            return d.PlanDto.parse(data);
        } catch (err) {
            console.error('plan.repo.getByCode', err);
            throw err;
        }
    },

    /**
     * Get an existing plan record by code (for validation purposes)
     * @param code - The code to check for existing plans
     * @returns The existing plan record or undefined if not found
     * @throws Error if plan is inactive or deleted
     */
    getExisting: async (
        code: t.TPlanDto['code']
    ): Promise<t.TPlanDto | undefined> => {
        if (!code) {
            return undefined;
        }

        try {
            const data = await db.single({
                code: { op: 'eq', value: code },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.is_active === false) {
                throwRecordInactive('Plan');
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Plan');
            }
            return d.PlanDto.parse(data);
        } catch (err) {
            console.error('plan.repo.getExisting', err);
            throw err;
        }
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
        const where: any = {
            deleted_at: { op: 'is', value: null },
            is_active: { op: 'eq', value: true },
        };

        if (filters.is_active !== undefined) {
            const value = filters.is_active;
            where.is_active = { op: 'eq', value };
        }
        if (filters.is_available !== undefined) {
            const value = filters.is_available;
            where.is_available = { op: 'eq', value };
        }
        if (filters.booking_frequency) {
            const value = filters.booking_frequency;
            where.booking_frequency = { op: 'eq', value };
        }
        if (filters.payment_frequency) {
            const value = filters.payment_frequency;
            where.payment_frequency = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.PlanDto.parse(r)) };
        } catch (err) {
            console.error('plan.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a plan record
     * @param id - The ID of the plan record to update
     * @param values - The plan values to update
     * @param existing - The existing plan record (optional, will fetch if not provided)
     * @returns The updated plan record
     * @throws Error if plan not found or validation fails
     */
    update: async (
        id: t.TPlanDto['id'],
        values: Partial<t.TPlanDto>,
        existing?: t.TPlanDto
    ): Promise<t.TPlanDto> => {
        const data = { ...values } as Partial<t.TPlanDto>;
        await repo.parse(values, d.PlanDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.code;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.PlanDto.parse(updated);
        } catch (err) {
            console.error('plan.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as planRepository };
export default repo;
