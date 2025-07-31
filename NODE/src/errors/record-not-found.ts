export class RecordNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RecordNotFoundError';
	}
}

export function throwRecordNotFound(message: string = ''): never {
	const msg = message || 'Record was not found';
	throw new RecordNotFoundError(msg);
}