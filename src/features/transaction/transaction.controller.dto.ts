import { z } from 'zod';
import { transactionDTO } from './transaction.dto';

export const transactionCreateDTO = transactionDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type TTransactionCreateDTO = z.infer<typeof transactionCreateDTO>;

export const transactionFindQueryDTO = transactionDTO.pick({
    userId: true,
    type: true,
    status: true,
    object: true,
    objectId: true,
}).partial();
export type TTransactionFindQueryDTO = z.infer<typeof transactionFindQueryDTO>;

export const transactionUpdateDTO = transactionDTO.partial().extend({
    userId: z.string().optional(),
});
export type TTransactionUpdateDTO = z.infer<typeof transactionUpdateDTO>;
