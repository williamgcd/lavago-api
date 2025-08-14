export class InvalidReqBodyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidReqBodyError';
    }
}
export const throwInvalidReqBody = (message: string = '') => {
    const msg = message || 'Invalid request body';
    throw new InvalidReqBodyError(msg);
};
