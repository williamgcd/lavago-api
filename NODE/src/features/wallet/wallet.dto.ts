import { z } from 'zod';

export const walletDTO = z.object({
    id: z.string().optional(),
    userId: z.string(),

    balance: z.number().default(0),
    currency: z.string().max(3).default('BRL'),
    
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TWalletDTO = z.infer<typeof walletDTO>;
