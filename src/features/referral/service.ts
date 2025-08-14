import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a referral record
     * @param values - The referral values to create
     * @returns The created referral record
     */
    create: async (values: t.TReferralDtoCreate) => {
        const created = await repo.create(values);
        emitter('referral.created', { id: created.id });
        return created;
    },

    /**
     * Delete a referral record
     * @param id - The id of the referral record to delete
     * @returns void
     */
    delete: async (id: t.TReferralDto['id']) => {
        const current = await repo.getById(id);
        emitter('referral.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a referral record by id
     * @param id - The id of the referral record to get
     * @returns The referral record
     */
    getById: async (id: t.TReferralDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List referral records
     * @param filters - The filters to apply to the referral records
     * @param pagination - The pagination to apply to the referral records
     * @returns The referral records
     */
    list: async (
        filters: t.TReferralDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TReferralDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List referral records by referral code
     * @param referral - The referral code to filter by
     * @param filters - The filters to apply to the referral records
     * @param pagination - The pagination to apply to the referral records
     * @returns The referral records
     */
    listByReferral: async (
        referral: t.TReferralDtoFilter['referral'],
        filters: t.TReferralDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TReferralDto[] }> => {
        filters.referral = referral;
        return repo.list(filters, pagination);
    },

    /**
     * List referral records by referred user id
     * @param referred_user_id - The referred user id to filter by
     * @param filters - The filters to apply to the referral records
     * @param pagination - The pagination to apply to the referral records
     * @returns The referral records
     */
    listByReferred: async (
        referred_user_id: t.TReferralDtoFilter['referred_user_id'],
        filters: t.TReferralDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TReferralDto[] }> => {
        filters.referred_user_id = referred_user_id;
        return repo.list(filters, pagination);
    },

    /**
     * List referral records by referrer user id
     * @param referrer_user_id - The referrer user id to filter by
     * @param filters - The filters to apply to the referral records
     * @param pagination - The pagination to apply to the referral records
     * @returns The referral records
     */
    listByReferrer: async (
        referrer_user_id: t.TReferralDtoFilter['referrer_user_id'],
        filters: t.TReferralDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TReferralDto[] }> => {
        filters.referrer_user_id = referrer_user_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a referral record
     * @param id - The id of the referral record to update
     * @param values - The referral values to update
     * @returns The updated referral record
     */
    update: async (id: t.TReferralDto['id'], values: t.TReferralDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('referral.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as referralService };
export default serv;
