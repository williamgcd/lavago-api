export const generator = {
    /**
     * Generates an expiration date in the future
     * @param minutes - the number of minutes to add to the current date
     * @returns The generated expiration date
     */
    expDate: (minutes: number = 5) => {
        return new Date(Date.now() + 10000 * 60 * minutes);
    },

    /**
     * Generates a random otp
     * @param length - the length of the otp
     * @returns The generated otp
     */
    otp: (length: number = 6) => {
        const equation = 100000 + Math.random() * 9000000;
        return Math.floor(equation).toString().substring(0, length);
    },

    /**
     * Generates a random referral code
     * @param length - the length of the referral code
     * @returns The generated referral code
     */
    referralCode: (length: number = 6) => {
        const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const code: string[] = [];
        for (let i = 0; i < length; i++) {
            // Get a random letter from the char string;
            code.push(char.charAt(Math.floor(Math.random() * char.length)));
        }
        return code.join('');
    },
};
