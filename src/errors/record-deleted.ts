export class RecordDeletedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RecordDeletedError';
    }
}
export const throwRecordDeleted = (term: string = 'Record') => {
    const msg = `${term} is deleted`;
    throw new RecordDeletedError(msg);
};
