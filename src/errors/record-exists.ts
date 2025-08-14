export class RecordExistsError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'RecordExistsError';
    }
}
export const throwRecordExists = (term: string = 'Record') => {
    const message = `${term} already exists`;
    throw new RecordExistsError(message);
};
export const throwIfRecordExists = (term = 'Record', record: boolean | any) =>
    !!record && throwRecordExists(term);
