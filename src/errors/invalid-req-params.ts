export class InvalidReqParamsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidReqParamsError';
    }
}
export const throwInvalidReqParams = (message: string = '') => {
    const msg = message || 'Invalid request parameters';
    throw new InvalidReqParamsError(msg);
};
