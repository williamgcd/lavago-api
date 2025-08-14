export class InvalidOtpError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidOtpError';
    }
}
export const throwInvalidOtp = (message: string = '') => {
    const msg = message || 'Invalid OTP';
    throw new InvalidOtpError(msg);
};
