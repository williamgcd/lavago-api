import z from 'zod';

import { zNull } from '@/shared/utils/zod';

export const WasherOfferingDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    offering_id: z.uuid(),
    washer_id: z.uuid(),

    is_certified: z.boolean().default(false),
    is_preferred: z.boolean().default(false),

    // Usage information
    usage_count: z.number().int().min(0).default(0),
    usage_level: z.number().int().min(0).default(0),
    usage_badge: z.string().max(40).default('novice'),

    last_used_at: zNull(z.coerce.date()),
    last_used_on: zNull(z.uuid()),

    // Rating information
    avg_rating: z.number().min(0).max(5).default(0),

    // Duration information
    avg_duration: z.number().int().min(0).default(0),
    max_duration: z.number().int().min(0).default(0),
    min_duration: z.number().int().min(0).default(0),

    // Training information
    certified_by: zNull(z.uuid()),
    certified_at: zNull(z.coerce.date()),

    trained_by: zNull(z.uuid()),
    trained_at: zNull(z.coerce.date()),

    // Washer payment information
    overwrite_washer_quota: z.number().int().min(0).default(0),
    overwrite_washer_share: z.number().int().min(0).default(0),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const WasherOfferingDtoCreate = WasherOfferingDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
})
    .partial()
    .refine(data => {
        return !!data.offering_id && !!data.washer_id;
    }, 'Offering ID and Washer ID are required');

export const WasherOfferingDtoDelete = WasherOfferingDto.pick({
    id: true,
});

export const WasherOfferingDtoFilter = WasherOfferingDto.pick({
    offering_id: true,
    washer_id: true,
    is_certified: true,
    is_preferred: true,
    usage_badge: true,
    certified_by: true,
    trained_by: true,
}).partial();

export const WasherOfferingDtoUpdate = WasherOfferingDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    offering_id: true,
    washer_id: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const WasherOfferingDtoById = z.object({
    washer_offering_id: WasherOfferingDto.shape.id,
});

export const WasherOfferingDtoByOfferingId = z.object({
    offering_id: WasherOfferingDto.shape.offering_id,
});

export const WasherOfferingDtoByWasherId = z.object({
    washer_id: WasherOfferingDto.shape.washer_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const WasherOfferingDtoPublic = WasherOfferingDto;
