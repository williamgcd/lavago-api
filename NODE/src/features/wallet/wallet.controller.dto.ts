import { z } from 'zod';
import { walletDTO } from './wallet.dto';

export const walletCreateDTO = walletDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type TWalletCreateDTO = z.infer<typeof walletCreateDTO>;

export const walletFindQueryDTO = z.object({
    balanceMin: z.number().optional(),
    balanceMax: z.number().optional(),
}).partial();
export type TWalletFindQueryDTO = z.infer<typeof walletFindQueryDTO>;

export const walletUpdateDTO = walletDTO.partial().extend({
    userId: z.string().optional(),
});
export type TWalletUpdateDTO = z.infer<typeof walletUpdateDTO>;
