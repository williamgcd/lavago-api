import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const ChatDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    status: z.enum(ENUMS.STATUS).default('pending'),

    // List of user IDs associated with the chat
    user_ids: z.array(z.uuid()).default([]),

    entity: z.string().min(1).max(40),
    entity_id: z.uuid(),
    entity_meta: z.record(z.string(), z.any()).default({}),

    label: zNull(z.string()),
    descr: zNull(z.string()),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const ChatDtoCreate = ChatDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const ChatDtoDelete = ChatDto.pick({
    id: true,
});

export const ChatDtoFilter = ChatDto.pick({
    status: true,
    entity: true,
    entity_id: true,
})
    .extend({
        user_id: z.uuid(),
    })
    .partial();

export const ChatDtoUpdate = ChatDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    entity: true,
    entity_id: true,
}).partial();

/* ************************** */
/* Controller DTOs
/* ************************** */

export const ChatDtoById = z.object({
    chat_id: ChatDto.shape.id,
});

export const ChatDtoByEntity = z.object({
    entity: ChatDto.shape.entity,
});

export const ChatDtoByEntityId = z.object({
    entity: ChatDto.shape.entity,
    entity_id: ChatDto.shape.entity_id,
});

export const ChatDtoByUserId = z.object({
    user_id: z.uuid(),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const ChatDtoPublic = ChatDto;
