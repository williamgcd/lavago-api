import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TChatUserDto = z.infer<typeof d.ChatUserDto>;

// Default CRUD DTOs
export type TChatUserDtoCreate = z.infer<typeof d.ChatUserDtoCreate>;
export type TChatUserDtoDelete = z.infer<typeof d.ChatUserDtoDelete>;

// Controller DTOs
export type TChatUserDtoByChatId = z.infer<typeof d.ChatUserDtoByChatId>;
export type TChatUserDtoByUserId = z.infer<typeof d.ChatUserDtoByUserId>;

// Public DTOs
export type TChatUserDtoPublic = z.infer<typeof d.ChatUserDtoPublic>;
