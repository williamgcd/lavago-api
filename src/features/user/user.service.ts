import { eventBus } from "@/libs/event-bus-client";
import { generatorUtils } from "@/utils/generators";

import { TUserEvents } from "./user.events";
import { userRepository } from "./user.repository";
import { TUser } from "./user.schema";

export const userService = {
    create: async (user: Omit<Partial<TUser>, 'id'>): Promise<TUser> => {
        const result = await userRepository.create(user);
        eventBus.emit<TUserEvents['user.created']>('user.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        await userRepository.deleteById(id);
        eventBus.emit<TUserEvents['user.deleted']>('user.deleted', { id });
    },

    find: async (
        limit: number,
        page: number,
        query?: Partial<Pick<TUser, 'name' | 'email' | 'phone' | 'document'>>,
    ): Promise<{ data: TUser[], total: number }> => {
        return userRepository.find(limit, page, query);
    },

    getById: async (id: string): Promise<TUser> => {
        return userRepository.getById(id);
    },

    getByEmail: async (email: string): Promise<TUser> => {
        return userRepository.getByEmail(email);
    },

    getByPhone: async (phone: string): Promise<TUser> => {
        return userRepository.getByPhone(phone);
    },

    otpCheck: async (phone: string, phoneOtp: string): Promise<TUser> => {
        const user = await userRepository.getByPhone(phone);
        if (user.phoneOtp !== phoneOtp) {
            throw new Error('Invalid OTP');
        }
        return userRepository.updateById(user.id, { phoneVerifiedAt: new Date() });
    },

    otpUpdateByPhone: async (phone: string): Promise<TUser> => {
        const otp = generatorUtils.generateOtp();
        const user = await userRepository.getByPhone(phone);
        return userRepository.updateById(user.id, { phoneOtp: otp, phoneOtpDate: new Date() });
    },

    updateById: async (id: string, user: Partial<TUser>): Promise<TUser> => {
        const prev = await userRepository.getById(id);
        const next = await userRepository.updateById(id, user);
        eventBus.emit<TUserEvents['user.updated']>('user.updated', { prev, next });
        return next;
    },
};