import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const ReferralDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    status: z.enum(ENUMS.STATUS).default('pending'),

    referrer_user_id: z.uuid(),
    referred_user_id: z.uuid(),

    referral: zNull(z.string().max(20)),

    label: z.string().min(1).max(255),
    value: z.number().int().min(0),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const ReferralDtoCreate = ReferralDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const ReferralDtoDelete = ReferralDto.pick({
    id: true,
});

export const ReferralDtoFilter = ReferralDto.pick({
    status: true,
    referrer_user_id: true,
    referred_user_id: true,
    referral: true,
}).partial();

export const ReferralDtoUpdate = ReferralDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    referrer_user_id: true,
    referred_user_id: true,
    referral: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const ReferralDtoById = z.object({
    referral_id: ReferralDto.shape.id,
});

export const ReferralDtoByReferral = z.object({
    referral: ReferralDto.shape.referral,
});

export const ReferralDtoByReferrer = z.object({
    referrer_user_id: ReferralDto.shape.referrer_user_id,
});

export const ReferralDtoByReferred = z.object({
    referred_user_id: ReferralDto.shape.referred_user_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const ReferralDtoPublic = ReferralDto;
