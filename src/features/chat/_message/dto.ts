import z from 'zod';

import { zNull } from '@/shared/utils/zod';

export const ChatMessageDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    // Either references a user or 'system'
    created_by: z.string().min(1).max(255).default('system'),

    chat_id: z.uuid(),

    type: z.string().min(1).max(40),
    text: z.string(),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const ChatMessageDtoCreate = ChatMessageDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const ChatMessageDtoDelete = ChatMessageDto.pick({
    id: true,
});

export const ChatMessageDtoFilter = ChatMessageDto.pick({
    chat_id: true,
    type: true,
    created_by: true,
}).partial();

export const ChatMessageDtoUpdate = ChatMessageDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    chat_id: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const ChatMessageDtoById = z.object({
    message_id: ChatMessageDto.shape.id,
});

export const ChatMessageDtoByChatId = z.object({
    chat_id: ChatMessageDto.shape.chat_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const ChatMessageDtoPublic = ChatMessageDto;
