export type TPagination = {
    limit?: number;
    order?: string;
    orderDir?: string;
    page?: number;
};

export type TPaginationRes = {
    limit: number;
    page: number;
    pages: number;
    total: number;
};
