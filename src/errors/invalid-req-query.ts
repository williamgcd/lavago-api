export class InvalidReqQueryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidReqQueryError';
    }
}
export const throwInvalidReqQuery = (message: string = '') => {
    const msg = message || 'Invalid request parameters';
    throw new InvalidReqQueryError(msg);
};
