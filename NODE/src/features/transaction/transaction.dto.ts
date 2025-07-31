import { z } from 'zod';
import { TRANSACTION_STATUS, TRANSACTION_TYPES } from './transaction.schema';

export const transactionDTO = z.object({
    id: z.string().optional(),
    userId: z.string(),
    type: z.enum(TRANSACTION_TYPES),
    value: z.number(),
    description: z.string().max(255).optional(),
    object: z.string().max(255).optional(),
    objectId: z.string().optional(),
    objectReference: z.string().max(255).optional(),
    status: z.enum(TRANSACTION_STATUS).default('PENDING'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TTransactionDTO = z.infer<typeof transactionDTO>;
