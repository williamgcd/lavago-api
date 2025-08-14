import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a coupon record
     * @param values - The coupon values to create
     * @returns The created coupon record
     */
    create: async (values: t.TCouponDtoCreate) => {
        const created = await repo.create(values);
        emitter('coupon.created', { id: created.id });
        return created;
    },

    /**
     * Delete a coupon record
     * @param id - The id of the coupon record to delete
     * @returns void
     */
    delete: async (id: t.TCouponDto['id']) => {
        const current = await repo.getById(id);
        emitter('coupon.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a coupon record by id
     * @param id - The id of the coupon record to get
     * @returns The coupon record
     */
    getById: async (id: t.TCouponDto['id']) => {
        return repo.getById(id);
    },

    /**
     * Get a coupon record by code
     * @param code - The code of the coupon record to get
     * @returns The coupon record
     */
    getByCode: async (code: t.TCouponDto['code']) => {
        return repo.getByCode(code);
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
        return repo.list(filters, pagination);
    },

    /**
     * List coupon records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the coupon records
     * @param pagination - The pagination to apply to the coupon records
     * @returns The coupon records
     */
    listByUserId: async (
        user_id: t.TCouponDtoFilter['user_id'],
        filters: t.TCouponDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TCouponDto[] }> => {
        filters.user_id = user_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a coupon record
     * @param id - The id of the coupon record to update
     * @param values - The coupon values to update
     * @returns The updated coupon record
     */
    update: async (id: t.TCouponDto['id'], values: t.TCouponDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('coupon.updated', {
            id: current.id,
            current,
            updated,
        });
        return updated;
    },
};

export { serv, serv as couponService };
export default serv; 