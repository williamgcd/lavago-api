import { eventBus } from "@/libs/event-bus-client";
import { TUser, userService } from "../user"
import { TAuthEvents } from "./auth.events";
import { tokenClient } from "@/libs/token-client";

export const authService = {


    otpCheck: async (phone: string, otp: string): Promise<string> => {
        const user = await userService.otpCheck(phone, otp);
        if (!user) {
            throw new Error('Invalid OTP');
        }
        eventBus.emit<TAuthEvents['auth.login']>('auth.login', { userId: user.id });
        return tokenClient.generateToken(user.id, user.phone);
    },

    otpSend: async (phone: string): Promise<void> => {
        const user = await userService.otpUpdateByPhone(phone);
        // TODO: Send OTP to phone
        console.log('authService.otpSend', 'OTP sent to phone', phone);
    },

    validateToken: async (token: string): Promise<TUser> => {
        const decoded = tokenClient.verify(token);
        if (!decoded) {
            throw new Error('Invalid token');
        }

        const { userId, phone } = decoded;
        const user = await userService.getById(userId);
        if (userId !== user.id || phone !== user.phone) {
            throw new Error('Invalid token');
        }
        return user;
    }
}