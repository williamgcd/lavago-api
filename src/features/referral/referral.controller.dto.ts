import { z } from 'zod';
import { referralDTO } from './referral.dto';

export const referralCreateDTO = referralDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type TReferralCreateDTO = z.infer<typeof referralCreateDTO>;

export const referralFindQueryDTO = referralDTO.pick({
    referrerUserId: true,
    referredUserId: true,
    status: true,
}).partial();
export type TReferralFindQueryDTO = z.infer<typeof referralFindQueryDTO>;

export const referralUpdateDTO = referralDTO.partial().extend({
    referrerUserId: z.string().optional(),
    referredUserId: z.string().optional(),
});
export type TReferralUpdateDTO = z.infer<typeof referralUpdateDTO>;
