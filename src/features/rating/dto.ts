import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const RatingDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    user_id: z.uuid(),

    // Entity this rating is about
    entity: z.string().min(1).max(40),
    entity_id: z.uuid(),
    entity_meta: z.record(z.string(), z.any()).default({}),

    label: z.string().min(1).max(255),
    descr: zNull(z.string()),

    metric: z.enum(ENUMS.METRIC),
    pattern: z.enum(ENUMS.PATTERN),

    scale: z.string().min(1).max(20),
    value: z.string().min(1).max(20),

    comment: zNull(z.string()),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const RatingDtoCreate = RatingDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const RatingDtoDelete = RatingDto.pick({
    id: true,
});

export const RatingDtoFilter = RatingDto.pick({
    user_id: true,
    entity: true,
    entity_id: true,
    metric: true,
    pattern: true,
}).partial();

export const RatingDtoUpdate = RatingDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    user_id: true,
    entity: true,
    entity_id: true,
}).partial();

/* ************************** */
/* Controller DTOs
/* ************************** */

export const RatingDtoById = z.object({
    rating_id: RatingDto.shape.id,
});

export const RatingDtoByUserId = z.object({
    user_id: RatingDto.shape.user_id,
});

export const RatingDtoByEntityId = z.object({
    entity: RatingDto.shape.entity,
    entity_id: RatingDto.shape.entity_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const RatingDtoPublic = RatingDto;
