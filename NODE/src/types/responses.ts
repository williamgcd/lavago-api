export type TResponse<T> = {
    status: 'ok';
    data: T;
} | {
    status: 'error';
    statusCode: number;
    error: string;
    message: string;
} | {
    status: 'unauthorized';
    error: string;
    message: string;
};

export type TResponseMessage = {
    status: 'ok' | 'error' | 'forbidden' | 'unauthorized';
    error?: string;
    message: string;
}

export type TResponsePaginated<T> = {
    status: 'ok';
    data: T[];
    pagination: {
        total: number;
        totalPages: number;
    };
}