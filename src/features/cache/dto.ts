import z from 'zod';
import { zNull } from '@/shared/utils/zod';
import { date } from '@/shared/utils/date';

export const CacheDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    expires_at: z.coerce.date().default(date.inTheFuture('days', 7)),

    entity: z.string().min(1).max(40),
    entity_key: z.string().min(1).max(255),
    entity_val: z.record(z.string(), z.any()).default({}),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const CacheDtoCreate = CacheDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
})
    .partial()
    .refine(data => {
        return !!data.entity && !!data.entity_key;
    }, 'Entity and entity_key are required');

export const CacheDtoDelete = CacheDto.pick({
    id: true,
});

export const CacheDtoFilter = CacheDto.pick({
    entity: true,
}).partial();

export const CacheDtoUpdate = CacheDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    entity: true,
    entity_key: true,
});

export const CacheDtoUpsert = CacheDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
})
    .partial()
    .refine(data => {
        return !!data.entity && !!data.entity_key;
    }, 'Entity and entity_key are required');

export const CacheDtoCheck = CacheDto.pick({
    entity: true,
    entity_key: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const CacheDtoById = z.object({
    cache_id: CacheDto.shape.id,
});

export const CacheDtoByEntity = z.object({
    entity: CacheDto.shape.entity,
});

export const CacheDtoByEntityKey = z.object({
    entity: CacheDto.shape.entity,
    entity_key: CacheDto.shape.entity_key,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const CacheDtoPublic = CacheDto;
