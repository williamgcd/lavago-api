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

const db = createDbClient('referrals');

const repo = {
    parse: async (data: Partial<t.TReferralDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('referral.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new referral record
     * @params values - the referral values to create
     * @returns the created referral record
     */
    create: async (
        values: Partial<t.TReferralDto>
    ): Promise<t.TReferralDto> => {
        const data = { ...values } as Partial<t.TReferralDto>;
        await repo.parse(data, d.ReferralDtoCreate);

        // Check if there is an existing record with the same code
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('Referral');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.ReferralDto.parse(created);
        } catch (err) {
            console.error('referral.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a referral record
     * @param id - The id of the referral record to delete
     * @param existing - The existing referral record
     * @returns void
     */
    delete: async (
        id: t.TReferralDto['id'],
        existing?: t.TReferralDto,
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
            console.error('referral.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a referral record by id
     * @param id - The id of the referral record to get
     * @returns The referral record
     */
    getById: async (value: t.TReferralDto['id']): Promise<t.TReferralDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Referral');
            }
            return d.ReferralDto.parse(data);
        } catch (err) {
            console.error('referral.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get an existing referral record
     * @param values - The values to get the existing referral record by
     * @returns The existing referral record
     */
    getExisting: async (
        values: Partial<t.TReferralDto>
    ): Promise<t.TReferralDto> => {
        if (!values.referred_user_id) {
            throw new Error('Referred user ID is required');
        }
        if (!values.referrer_user_id) {
            throw new Error('Referrer user ID is required');
        }
        if (!values.referral) {
            throw new Error('Referral code is required');
        }

        try {
            const data = await db.single({
                deleted_at: { op: 'is', value: null },
                referred_user_id: { op: 'eq', value: values.referred_user_id },
                referrer_user_id: { op: 'eq', value: values.referrer_user_id },
                referral: { op: 'eq', value: values.referral },
            });
            if (!data || !data.id) {
                throwRecordMissing('Referral');
            }
            return d.ReferralDto.parse(data);
        } catch (err) {
            console.error('referral.repo.getExisting', err);
            throw err;
        }
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
        const where: any = {};

        if (filters.status) {
            const value = filters.status;
            where.status = { op: 'eq', value };
        }
        if (filters.referrer_user_id) {
            const value = filters.referrer_user_id;
            where.referrer_user_id = { op: 'eq', value };
        }
        if (filters.referred_user_id) {
            const value = filters.referred_user_id;
            where.referred_user_id = { op: 'eq', value };
        }
        if (filters.referral) {
            const value = filters.referral;
            where.referral = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.ReferralDto.parse(r)) };
        } catch (err) {
            console.error('referral.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a referral record
     * @param id - The id of the referral record to update
     * @param values - The referral values to update
     * @param existing - The existing referral record
     * @returns The updated referral record
     */
    update: async (
        id: t.TReferralDto['id'],
        values: Partial<t.TReferralDto>,
        existing?: t.TReferralDto
    ): Promise<t.TReferralDto> => {
        const data = { ...values } as Partial<t.TReferralDto>;
        await repo.parse(values, d.ReferralDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.referrer_user_id;
        delete data.referred_user_id;
        delete data.referral;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.ReferralDto.parse(updated);
        } catch (err) {
            console.error('referral.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as referralRepository };
export default repo;
