export type TRequestPaginated<T> = {
    filters?: Partial<T>;
    limit?: number;
    offset?: number;
};