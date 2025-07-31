import { z } from 'zod';
import { REFERRAL_STATUS } from './referral.schema';

export const referralDTO = z.object({
    id: z.string().optional(),
    referrerUserId: z.string(),
    referredUserId: z.string(),
    value: z.number(),
    status: z.enum(REFERRAL_STATUS).default('PENDING'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TReferralDTO = z.infer<typeof referralDTO>;
