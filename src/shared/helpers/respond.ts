import { Request, Response, NextFunction } from 'express';

export const respond = {
    created: (res: Response, data: any) => {
        const response = { status: 'ok', data };
        return res.status(201).json(response);
    },

    deleted: (res: Response) => {
        const response = { status: 'ok' };
        return res.status(204).json(response);
    },

    empty: (res: Response) => {
        return res.status(204).send();
    },

    message: (res: Response, message: string) => {
        const response = { status: 'ok', message };
        return res.status(200).json(response);
    },

    success: (res: Response, data: any) => {
        const response = { status: 'ok', data };
        return res.status(200).json(response);
    },

    paginated: (res: Response, data: any, pagination: any) => {
        const response = { status: 'ok', data, pagination };
        return res.status(200).json(response);
    },
};
