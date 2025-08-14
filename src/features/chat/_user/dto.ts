import z from 'zod';

export const ChatUserDto = z.object({
    chat_id: z.uuid(),
    user_id: z.uuid(),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const ChatUserDtoCreate = ChatUserDto;
export const ChatUserDtoDelete = ChatUserDto;

/* ************************** */
/* Controller DTOs
/* ************************** */

export const ChatUserDtoByChatId = z.object({
    chat_id: z.uuid(),
});
export const ChatUserDtoByUserId = z.object({
    user_id: z.uuid(),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const ChatUserDtoPublic = z.object({
    id: z.uuid(),
    name: z.string(),
});
