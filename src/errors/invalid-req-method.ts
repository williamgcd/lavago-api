export class InvalidReqMethodError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidReqMethodError';
    }
}
export const throwInvalidReqMethod = (message: string = '') => {
    const msg = message || 'Invalid request method';
    throw new InvalidReqMethodError(msg);
};
