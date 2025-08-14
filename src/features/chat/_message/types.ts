import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TChatMessageDto = z.infer<typeof d.ChatMessageDto>;

// Default CRUD DTOs
export type TChatMessageDtoCreate = z.infer<typeof d.ChatMessageDtoCreate>;
export type TChatMessageDtoDelete = z.infer<typeof d.ChatMessageDtoDelete>;
export type TChatMessageDtoFilter = z.infer<typeof d.ChatMessageDtoFilter>;
export type TChatMessageDtoUpdate = z.infer<typeof d.ChatMessageDtoUpdate>;

// Controller DTOs
export type TChatMessageDtoById = z.infer<typeof d.ChatMessageDtoById>;
export type TChatMessageDtoByChatId = z.infer<typeof d.ChatMessageDtoByChatId>;

// Public DTOs
export type TChatMessageDtoPublic = z.infer<typeof d.ChatMessageDtoPublic>;
