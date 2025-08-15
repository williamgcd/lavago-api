import { ZodObject } from 'zod';

import {
    throwRecordDeleted,
    throwRecordExists,
    throwRecordMissing,
} from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('coupons');

const repo = {
    /**
     * Creates a new coupon record
     * @params values - the coupon values to create
     * @returns the created coupon record
     */
    create: async (values: Partial<t.TCouponDto>): Promise<t.TCouponDto> => {
        const data = { ...values } as Partial<t.TCouponDto>;
        await repo.parse(data, d.CouponDtoCreate);

        // Check if there is an existing record with the same code
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('Coupon');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.CouponDto.parse(created);
        } catch (err) {
            console.error('coupon.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a coupon record
     * @param id - The id of the coupon record to delete
     * @param existing - The existing coupon record
     * @returns void
     */
    delete: async (
        id: t.TCouponDto['id'],
        existing?: t.TCouponDto,
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
            console.error('coupon.repo.delete', err);
            throw err;
        }
    },

    /**
     * Filter coupon records
     * @param filters - The filters to apply to the coupon records
     * @returns The filtered coupon records
     */
    filter: async (filters: t.TCouponDtoFilter) => {
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        if (filters.is_active !== undefined) {
            const value = filters.is_active;
            where.is_active = { op: 'eq', value };
        }
        if (filters.discount_type) {
            const value = filters.discount_type;
            where.discount_type = { op: 'eq', value };
        }
        if (filters.allowed_users) {
            const value = filters.allowed_users;
            where.allowed_users = { op: 'contains', value };
        }
        if (filters.blocked_users) {
            const value = filters.blocked_users;
            where.blocked_users = { op: 'contains', value };
        }
        if (filters.user_id) {
            const user_id = filters.user_id;
            where.allowed_users = { op: 'contains', value: user_id };
            where.blocked_users = { op: 'not.contains', value: user_id };
        }

        return where;
    },

    /**
     * Get a coupon record by id
     * @param id - The id of the coupon record to get
     * @returns The coupon record
     */
    getById: async (value: t.TCouponDto['id']): Promise<t.TCouponDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Coupon');
            }
            return d.CouponDto.parse(data);
        } catch (err) {
            console.error('coupon.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get a coupon record by code
     * @param code - The code of the coupon record to get
     * @returns The coupon record
     */
    getByCode: async (value: t.TCouponDto['code']): Promise<t.TCouponDto> => {
        try {
            const data = await db.single({
                code: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Coupon');
            }
            return d.CouponDto.parse(data);
        } catch (err) {
            console.error('coupon.repo.getByCode', err);
            throw err;
        }
    },

    /**
     * Get an existing coupon record by code
     * @param values - The coupon values to check
     * @returns The existing coupon record or undefined
     */
    getExisting: async (values: Partial<t.TCouponDto>) => {
        if (!values.code) {
            return undefined;
        }

        try {
            const data = await db.single({
                code: { op: 'eq', value: values.code },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Coupon');
            }
            return d.CouponDto.parse(data);
        } catch (err) {
            console.error('coupon.repo.getExisting', err);
            throw err;
        }
    },

    /**
     * List coupon records
     * @param filters - The filters to apply to the coupon records
     * @param pagination - The pagination to apply to the coupon records
     * @returns The coupon records
     */
    list: async (
        filters: t.TCouponDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TCouponDto[] }> => {
        const where = await repo.filter(filters);
        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.CouponDto.parse(r)) };
        } catch (err) {
            console.error('coupon.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a coupon record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed coupon record
     */
    parse: async (data: Partial<t.TCouponDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('coupon.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a coupon record
     * @param id - The id of the coupon record to update
     * @param values - The coupon values to update
     * @param existing - The existing coupon record
     * @returns The updated coupon record
     */
    update: async (
        id: t.TCouponDto['id'],
        values: Partial<t.TCouponDto>,
        existing?: t.TCouponDto
    ): Promise<t.TCouponDto> => {
        const data = { ...values } as Partial<t.TCouponDto>;
        await repo.parse(values, d.CouponDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.CouponDto.parse(updated);
        } catch (err) {
            console.error('coupon.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as couponRepository };
export default repo;
