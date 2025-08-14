import { ZodObject } from 'zod';

import {
    throwIfRecordExists,
    throwRecordDeleted,
    throwRecordExists,
    throwRecordMissing,
} from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';
import { generator } from '@/shared/utils/generator';

const db = createDbClient('users');

const repo = {
    /**
     * Parse and validate data against a Zod schema
     * @param data - The data to validate
     * @param schema - The Zod schema to validate against
     * @returns The parsed and validated data
     * @throws Error if validation fails
     */
    parse: async (data: Partial<t.TUserDto>, schema: ZodObject) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('user.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new user record with default OTP and referral code
     * @param values - The user values to create
     * @returns The created user record
     * @throws Error if user with same email/phone already exists
     * @throws Error if validation fails
     */
    create: async (values: Partial<t.TUserDto>): Promise<t.TUserDto> => {
        const data = { ...values } as Partial<t.TUserDto>;
        console.log(data);
        await repo.parse(data, d.UserDtoCreate);

        // Check if there is an existing record
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('User');
        }

        // Set default create fields
        data.email_otp = generator.otp();
        data.phone_otp = generator.otp();
        data.email_otp_expires_at = generator.expDate();
        data.phone_otp_expires_at = generator.expDate();
        data.referral = generator.referralCode();

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.UserDto.parse(created);
        } catch (err) {
            console.error('user.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a user record (soft delete by default)
     * @param id - The ID of the user record to delete
     * @param existing - The existing user record (optional, will fetch if not provided)
     * @param hard - Whether to perform hard delete (default: false)
     * @returns Promise that resolves to void
     * @throws Error if user not found
     */
    delete: async (
        id: t.TUserDto['id'],
        existing?: t.TUserDto,
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
            console.error('user.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a user record by ID
     * @param value - The ID of the user record to get
     * @returns The user record
     * @throws Error if user not found
     */
    getById: async (value: t.TUserDto['id']): Promise<t.TUserDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('User');
            }
            return d.UserDto.parse(data);
        } catch (err) {
            console.error('user.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get a user record by email
     * @param email - The email of the user record to get
     * @returns The user record
     */
    getByEmail: async (value: t.TUserDto['email']): Promise<t.TUserDto> => {
        try {
            const data = await db.single({
                email: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('User');
            }
            return d.UserDto.parse(data);
        } catch (err) {
            console.error('user.repo.getByEmail', err);
            throw err;
        }
    },

    /**
     * Get a user record by phone
     * @param phone - The phone of the user record to get
     * @returns The user record
     */
    getByPhone: async (value: t.TUserDto['phone']): Promise<t.TUserDto> => {
        try {
            const data = await db.single({
                phone: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('User');
            }
            return d.UserDto.parse(data);
        } catch (err) {
            console.error('user.repo.getByPhone', err);
            throw err;
        }
    },

    /**
     * Get a user record by referral
     * @param referral - The referral of the user record to get
     * @returns The user record
     */
    getByReferral: async (
        value: t.TUserDto['referral']
    ): Promise<t.TUserDto> => {
        try {
            const data = await db.single({
                referral: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('User');
            }
            return d.UserDto.parse(data);
        } catch (err) {
            console.error('user.repo.getByReferral', err);
            throw err;
        }
    },

    /**
     * Get an existing user record by email or phone
     * @param values - The email or phone of the user record to get
     * @returns The user record
     */
    getExisting: async (values: Partial<t.TUserDto>) => {
        const or = [];
        if (values.email) {
            const value = values.email;
            or.push({ op: 'eq', field: 'email', value });
        }
        if (values.phone) {
            const value = values.phone;
            or.push({ op: 'eq', field: 'phone', value });
        }
        if (or.length === 0) {
            throw new Error('Either email or phone is required');
        }

        try {
            const data = await db.single({ or });
            if (!data) {
                return undefined;
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('User');
            }
            return d.UserDto.parse(data);
        } catch (err) {
            console.error('user.repo.getExisting', err);
            throw err;
        }
    },

    /**
     * List user records
     * @param filters - The filters to apply to the user records
     * @param pagination - The pagination to apply to the user records
     * @returns The user records
     */
    list: async (
        filters: t.TUserDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TUserDto[] }> => {
        const where: any = {};

        if (filters.email) {
            const value = filters.email;
            where.email = { op: 'ilike', value: `%${value}%` };
        }
        if (filters.phone) {
            const value = filters.phone;
            where.phone = { op: 'ilike', value: `%${value}%` };
        }
        if (filters.role) {
            const value = filters.role;
            where.role = { op: 'eq', value };
        }
        if (filters.user_ids && filters.user_ids.length > 0) {
            const value = filters.user_ids;
            where.id = { op: 'in', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.UserDto.parse(r)) };
        } catch (err) {
            console.error('user.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a user record
     * @param id - The id of the user record to update
     * @param values - The user values to update
     * @param existing - The existing user record
     * @returns The updated user record
     */
    update: async (
        id: t.TUserDto['id'],
        values: Partial<t.TUserDto>,
        existing?: t.TUserDto
    ): Promise<t.TUserDto> => {
        const data = { ...values } as Partial<t.TUserDto>;
        await repo.parse(values, d.UserDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Check if email or phone already exists for another user
        if (data.email && data.email !== record.email) {
            const { email } = record;
            const exists = await repo.getExisting({ email });
            throwIfRecordExists('User with email', exists);
        }
        if (data.phone && data.phone !== record.phone) {
            const { phone } = record;
            const exists = await repo.getExisting({ phone });
            throwIfRecordExists('User with phone', exists);
        }

        // Remove fields that should not be updated
        // These are usually the filters checked on getExisting;
        delete data.id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.UserDto.parse(updated);
        } catch (err) {
            console.error('user.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as userRepository };
export default repo;
