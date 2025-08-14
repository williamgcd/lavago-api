import z from 'zod';
import { PAGINATION } from '../constants/common';

export const PaginationDto = z.object({
    limit: z.coerce
        .number()
        .max(PAGINATION.LIMIT_MAX)
        .default(PAGINATION.LIMIT),
    order: z.string().default('id'),
    orderDir: z.enum(['asc', 'desc']).default('desc'),
    page: z.number().min(1).default(1),
});
