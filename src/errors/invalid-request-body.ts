export class InvalidRequestBodyError extends Error {
	constructor(message: string) {
		super(message);
        this.name = 'InvalidRequestBodyError';
	}
}

export function throwInvalidRequestBody(message: string = ''): never {
	const msg = message || 'Invalid request body';
	throw new InvalidRequestBodyError(msg);
}