export class InvalidRequestParamError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidRequestParamError';
	}
}

export function throwInvalidRequestParam(message: string = ''): never {
	const msg = message || 'Invalid request parameters';
	throw new InvalidRequestParamError(msg);
}