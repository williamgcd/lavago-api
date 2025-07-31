export class RecordDuplicatedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RecordDuplicatedError';
	}
}

export function throwRecordDuplicated(message: string = ''): never {
	const msg = message || 'Record would be duplicated';
	throw new RecordDuplicatedError(msg);
}