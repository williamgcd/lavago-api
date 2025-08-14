export class RecordInactiveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RecordInactiveError';
    }
}
export const throwRecordInactive = (term: string = 'Record') => {
    const msg = `${term} is not active`;
    throw new RecordInactiveError(msg);
};
