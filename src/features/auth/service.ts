import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { authClient } from '@/shared/clients/auth';
import { userService } from '../user/service';

const serv = {
    /**
     * Create a auth record
     * @param values - The auth values to create
     * @returns The created auth record
     */
    create: async (values: t.TAuthDtoCreate) => {
        const user = await userService.create(values);
        emitter('auth.registered', { id: user.id });

        if (user.email) {
            await serv.otpEmailUpdate(user.email);
        }
        if (user.phone) {
            await serv.otpPhoneUpdate(user.phone);
        }

        const auth = { user_id: user.id, ...user };
        return await authClient.signUp(auth);
    },

    /**
     * Get the active auth record
     * @returns The auth record
     */
    getUser: async () => {
        return authClient.getActiveUser();
    },

    /**
     * Check if an email OTP is valid
     * @param value - The email of the user record to check
     * @param otp - The OTP to check
     * @returns The updated user record
     */
    otpEmailCheck: async (value: string, otp: string) => {
        const user = await userService.otpEmailCheck(value, otp);
        const auth = { user_id: user.id, ...user };
        return await authClient.auth(auth);
    },

    /**
     * Update a user record's email OTP
     * @param value - The email of the user record to update
     * @returns The updated user record
     */
    otpEmailUpdate: async (value: string) => {
        const user = await userService.otpEmailUpdate(value);
        // TODO: Send OTP to user's email;
        const logMessage = `Sent OTP ${user.email_otp} to email: ${user.email}`;
        console.log('authService.otpEmailUpdate', logMessage);
    },

    /**
     * Check if a phone OTP is valid
     * @param value - The phone of the user record to check
     * @param otp - The OTP to check
     * @returns The updated user record
     */
    otpPhoneCheck: async (value: string, otp: string) => {
        const user = await userService.otpPhoneCheck(value, otp);
        const auth = { user_id: user.id, ...user };
        return await authClient.auth(auth);
    },

    /**
     * Update a user record's phone OTP
     * @param value - The phone of the user record to update
     * @returns The updated user record
     */
    otpPhoneUpdate: async (value: string) => {
        const user = await userService.otpPhoneUpdate(value);

        // TEMP: Remove after testing.
        const auth = { user_id: user.id, role: user.role, phone: value };
        console.log(await authClient.auth(auth));

        // TODO: Send OTP to user's phone;
        const logMessage = `Sent OTP ${user.phone_otp} to phone: ${user.phone}`;
        console.log('authService.otpPhoneUpdate', logMessage);
    },
};

export { serv, serv as authService };
export default serv;
