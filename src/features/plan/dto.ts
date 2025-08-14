import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { SUBSCRIPTION_ENUMS } from '../subscription/enums';

export const PlanDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    // Controls if the plan is active
    // All users on the plan will be paused
    is_active: z.boolean().default(true),

    // Controls if users have access to this plans
    is_available: z.boolean().default(true),

    code: z.string().max(40),

    label: z.string().max(255),
    descr: zNull(z.string()),

    // How much we discount the user for the subscription
    // The pricing depends on the offering and the vehicle they choose.
    discount: z.coerce.number().default(0),

    // Frequency for the user for booking and payment.
    // We can create a booking every week, charge every 6 months.
    booking_frequency: z
        .enum(SUBSCRIPTION_ENUMS.BOOKING_FREQUENCY)
        .default('every_month'),
    payment_frequency: z
        .enum(SUBSCRIPTION_ENUMS.PAYMENT_FREQUENCY)
        .default('every_month'),

    // Number of bookings within the payment period
    // `limit` is the maximum number of bookings allowed, NULL is unlimited.
    booking_limit: zNull(z.coerce.number()),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const PlanDtoCreate = PlanDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const PlanDtoDelete = PlanDto.pick({
    id: true,
});

export const PlanDtoFilter = PlanDto.pick({
    is_active: true,
    is_available: true,
    booking_frequency: true,
    payment_frequency: true,
}).partial();

export const PlanDtoUpdate = PlanDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const PlanDtoById = z.object({
    plan_id: PlanDto.shape.id,
});

export const PlanDtoByCode = z.object({
    code: PlanDto.shape.code,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const PlanDtoPublic = PlanDto;
