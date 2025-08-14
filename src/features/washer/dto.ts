import z from 'zod';

import { zKeyInterval, zNull } from '@/shared/utils/zod';
import { WASHER } from '@/shared/constants/common';

export const WasherDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    user_id: z.uuid(),

    avgRating: z.number().optional(),
    avgRatingCount: z.number().optional(),

    // Geocoding/Geofencing information
    lastLat: z.number().optional(),
    lastLng: z.number().optional(),
    lastSeenAt: z.date().optional(),

    default_hours: zKeyInterval.default(WASHER.DEFAULT_HOURS),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const WasherDtoCreate = WasherDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const WasherDtoDelete = WasherDto.pick({
    id: true,
});

export const WasherDtoFilter = WasherDto.pick({}).partial();

export const WasherDtoUpdate = WasherDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    user_id: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const WasherDtoById = z.object({
    washer_id: WasherDto.shape.id,
});
export const WasherDtoByUserId = z.object({
    user_id: z.uuid(),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const WasherDtoPublic = WasherDto;
