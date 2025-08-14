export class RecordMissingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RecordMissingError';
    }
}
export const throwRecordMissing = (term = 'Record') => {
    const msg = `${term} not found`;
    throw new RecordMissingError(msg);
};
export const throwIfRecordMissing = (term = 'Record', record: boolean | any) =>
    !!record && throwRecordMissing(term);
