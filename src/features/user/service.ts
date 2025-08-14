import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';
import { date } from '@/shared/utils/date';
import { generator } from '@/shared/utils/generator';
import { throwInvalidOtp } from '@/errors';

const serv = {
    /**
     * Create a user record with event emission
     * @param values - The user values to create
     * @returns The created user record
     * @throws Error if validation fails or user with same email/phone exists
     */
    create: async (values: t.TUserDtoCreate) => {
        const created = await repo.create(values);
        emitter('user.created', { id: created.id });
        return created;
    },

    /**
     * Delete a user record with event emission
     * @param id - The ID of the user record to delete
     * @returns Promise that resolves to void
     * @throws Error if user not found
     */
    delete: async (id: t.TUserDto['id']) => {
        const current = await repo.getById(id);
        emitter('user.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a user record by ID
     * @param id - The ID of the user record to get
     * @returns The user record
     * @throws Error if user not found
     */
    getById: async (id: t.TUserDto['id']) => {
        return repo.getById(id);
    },

    /**
     * Get a user record by email
     * @param email - The email of the user record to get
     * @returns The user record
     * @throws Error if user not found
     */
    getByEmail: async (email: string) => {
        return repo.getByEmail(email);
    },

    /**
     * Get a user record by phone
     * @param phone - The phone of the user record to get
     * @returns The user record
     * @throws Error if user not found
     */
    getByPhone: async (phone: string) => {
        return repo.getByPhone(phone);
    },

    /**
     * Get a user record by referral code
     * @param referral - The referral code of the user record to get
     * @returns The user record
     * @throws Error if user not found
     */
    getByReferral: async (referral: string) => {
        return repo.getByReferral(referral);
    },

    /**
     * List user records with filtering and pagination
     * @param filters - The filters to apply to the user records
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of user records
     * @throws Error if database query fails
     */
    list: async (
        filters: t.TUserDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TUserDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List user records by user IDs with filtering and pagination
     * @param user_ids - The user IDs to filter by
     * @param filters - The filters to apply to the user records (optional)
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of user records
     * @throws Error if database query fails
     */
    listByUserIds: async (
        user_ids: t.TUserDtoFilter['user_ids'],
        filters: t.TUserDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TUserDto[] }> => {
        filters.user_ids = user_ids;
        return repo.list(filters, pagination);
    },

    /**
     * Check if an email OTP is valid
     * @param email - The email of the user record to check
     * @param otp - The OTP to check
     * @returns The updated user record
     */
    otpEmailCheck: async (email: t.TUserDto['email'], otp: string) => {
        const user = await repo.getByEmail(email);

        if (email !== user.email) {
            console.info('user.serv.otpEmailCheck', 'email', email);
            throwInvalidOtp();
        }
        if (otp !== user.email_otp) {
            console.info('user.serv.otpEmailCheck', 'otp', otp);
            throwInvalidOtp();
        }
        const expires_at = user.email_otp_expires_at;
        if (!expires_at || date.hasExpired(expires_at)) {
            console.info('user.serv.otpEmailCheck', 'hasExpired');
            throwInvalidOtp();
        }

        const data: Partial<t.TUserDto> = {
            email_otp: null,
            email_otp_checked_at: new Date(),
            email_otp_expires_at: null,
        };
        return repo.update(user.id, data, user);
    },

    /**
     * Update a user record's email OTP
     * @param email - The email of the user record to update
     * @returns The updated user record
     */
    otpEmailUpdate: async (email: t.TUserDto['email']) => {
        const user = await serv.getByEmail(email);
        // TODO: Only generates a new OTP if the old one is expired
        const expires_at = user.email_otp_expires_at;
        if (user.email_otp && (!expires_at || date.hasExpired(expires_at))) {
            return user;
        }
        const data: Partial<t.TUserDto> = {
            email_otp: generator.otp(),
            email_otp_expires_at: generator.expDate(),
        };
        return repo.update(user.id, data, user);
    },

    /**
     * Check if a phone OTP is valid
     * @param phone - The phone of the user record to check
     * @param otp - The OTP to check
     * @returns The updated user record
     */
    otpPhoneCheck: async (phone: t.TUserDto['phone'], otp: string) => {
        const user = await repo.getByPhone(phone);

        if (phone !== user.phone) {
            console.info('user.serv.otpPhoneCheck', 'phone', phone);
            throwInvalidOtp();
        }
        if (otp !== user.phone_otp) {
            console.info('user.serv.otpPhoneCheck', 'otp', otp);
            throwInvalidOtp();
        }
        const expires_at = user.phone_otp_expires_at;
        if (!expires_at || date.hasExpired(expires_at)) {
            console.info('user.serv.otpPhoneCheck', 'hasExpired');
            throwInvalidOtp();
        }

        const data: Partial<t.TUserDto> = {
            phone_otp: null,
            phone_otp_checked_at: new Date(),
            phone_otp_expires_at: null,
        };
        return repo.update(user.id, data, user);
    },

    /**
     * Update a user record's phone OTP
     * @param phone - The phone of the user record to update
     * @returns The updated user record
     */
    otpPhoneUpdate: async (phone: t.TUserDto['phone']) => {
        const user = await serv.getByPhone(phone);
        // Only generates a new OTP if the old one is expired
        const expires_at = user.phone_otp_expires_at;
        if (user.phone_otp && date.hasExpired(expires_at)) {
            return user;
        }
        const data: Partial<t.TUserDto> = {
            phone_otp: generator.otp(),
            phone_otp_expires_at: generator.expDate(),
        };
        return repo.update(user.id, data, user);
    },

    /**
     * Update a user record
     * @param id - The id of the user record to update
     * @param values - The user values to update
     * @returns The updated user record
     */
    update: async (id: t.TUserDto['id'], values: t.TUserDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('user.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as userService };
export default serv;
