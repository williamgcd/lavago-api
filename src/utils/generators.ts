import { v4 as uuidv4 } from 'uuid';

export const generatorUtils = {
    /**
     * Generates a UUID
     * @returns The generated UUID
     */
    generateUuid: () => {
        return uuidv4();
    },

    /**
     * Generates a OTP
     * @returns The generated OTP
     */
    generateOtp: (length: number = 6) => {
        return Math.floor(100000 + Math.random() * 9000000).toString().substring(0, length);
    },

    /**
     * Generates a referral code
     * @returns The generated referral code
     */
    generateReferralCode: (length: number = 6) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
};