import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const SubscriptionDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    plan_id: zNull(z.uuid()),
    user_id: z.uuid(),

    is_active: z.boolean().default(true),
    is_automated: z.boolean().default(true),

    status: z.enum(ENUMS.STATUS).default('active'),

    // How much we discount the user for the subscription
    // The pricing depends on the offering and the vehicle they choose.
    discount: z.coerce.number().default(0),

    // If automated, how ofter booking will be created;
    booking_frequency: z.enum(ENUMS.BOOKING_FREQUENCY).default('every_month'),
    booking_frequency_in_days: z.coerce.number().default(30),

    last_booking_date: zNull(z.coerce.date()),
    next_booking_date: zNull(z.coerce.date()),

    // Number of bookings within the payment period
    // `limit` is the maximum number of bookings allowed
    // `count` is the current cycle count.
    // `total` is the total bookings scheduled, ever.
    booking_limit: zNull(z.coerce.number()),
    booking_count: z.coerce.number().default(0),
    booking_total: z.coerce.number().default(0),

    // When will we change the user for their subscription
    payment_frequency: z.enum(ENUMS.PAYMENT_FREQUENCY).default('every_month'),
    payment_frequency_in_days: z.coerce.number().default(30),

    last_payment_date: zNull(z.coerce.date()),
    next_payment_date: zNull(z.coerce.date()),

    // Payment provider information
    // We use this information to interact with the provider
    payment_provider: zNull(z.string().max(40).default('pagbank')),
    payment_provider_id: zNull(z.string().max(255)),
    payment_provider_meta: zNull(z.record(z.string(), z.any()).default({})),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const SubscriptionDtoCreate = SubscriptionDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    status: true,
});

export const SubscriptionDtoDelete = SubscriptionDto.pick({
    id: true,
});

export const SubscriptionDtoFilter = SubscriptionDto.pick({
    plan_id: true,
    user_id: true,
    is_active: true,
    is_automated: true,
    status: true,
}).partial();

export const SubscriptionDtoUpdate = SubscriptionDto.pick({
    is_active: true,
    is_automated: true,
    status: true,
    discount: true,
    booking_frequency: true,
    booking_frequency_in_days: true,
    last_booking_date: true,
    next_booking_date: true,
    booking_limit: true,
    booking_count: true,
    booking_total: true,
    payment_frequency: true,
    payment_frequency_in_days: true,
    last_payment_date: true,
    next_payment_date: true,
    payment_provider: true,
    payment_provider_id: true,
    payment_provider_meta: true,
}).partial();

/* ************************** */
/* Controller DTOs
/* ************************** */

export const SubscriptionDtoById = z.object({
    subscription_id: SubscriptionDto.shape.id,
});
export const SubscriptionDtoByPlanId = z.object({
    plan_id: SubscriptionDto.shape.plan_id,
});
export const SubscriptionDtoByUserId = z.object({
    user_id: SubscriptionDto.shape.user_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const SubscriptionDtoPublic = SubscriptionDto.omit({
    payment_provider: true,
    payment_provider_id: true,
    payment_provider_meta: true,
});
