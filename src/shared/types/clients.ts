export type TDbClientFilter = {
    op: string;
    field?: string;
    value: any;
};
export type TDbClientFilters = {
    [key: string]: TDbClientFilter | TDbClientFilter[];
};
