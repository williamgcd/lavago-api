import { Request } from 'express';

export const parseBody = (req: Request) => {
    // If body is already parsed, return it
    if (req.body && typeof req.body === 'object') {
        return req.body;
    }

    // Try to parse as JSON
    try {
        return JSON.parse(req.body || '{}');
    } catch (error) {
        console.error('Failed to parse webhook payload:', error);
        return {};
    }
};
