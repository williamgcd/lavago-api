import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const CouponDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    // Status
    is_active: z.boolean().default(true),

    // Basic info
    code: z.string().min(1).max(50),
    description: zNull(z.string()),

    // Discount details
    discount_type: z.enum(ENUMS.DISCOUNT_TYPE),
    discount_value: z.number().int().min(0),

    // Usage limits
    usage_limit: zNull(z.number().int().min(0)),
    usage_count: z.number().int().min(0).default(0),

    // User restrictions
    allowed_users: zNull(z.array(z.uuid())),
    blocked_users: zNull(z.array(z.uuid())),

    // Validity
    valid_from: zNull(z.coerce.date()),
    valid_until: zNull(z.coerce.date()),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const CouponDtoCreate = CouponDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    usage_count: true,
});

export const CouponDtoDelete = CouponDto.pick({
    id: true,
});

export const CouponDtoFilter = CouponDto.pick({
    is_active: true,
    discount_type: true,
    allowed_users: true,
    blocked_users: true,
})
    .extend({
        user_id: z.uuid(),
    })
    .partial();

export const CouponDtoUpdate = CouponDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    code: true,
    usage_count: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const CouponDtoById = z.object({
    coupon_id: CouponDto.shape.id,
});

export const CouponDtoByCode = z.object({
    code: CouponDto.shape.code,
});

export const CouponDtoByUserId = z.object({
    user_id: z.uuid(),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const CouponDtoPublic = CouponDto.omit({
    allowed_users: true,
    blocked_users: true,
});
