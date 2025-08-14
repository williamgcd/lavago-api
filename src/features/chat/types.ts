import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TChatDto = z.infer<typeof d.ChatDto>;

// Default CRUD DTOs
export type TChatDtoCreate = z.infer<typeof d.ChatDtoCreate>;
export type TChatDtoDelete = z.infer<typeof d.ChatDtoDelete>;
export type TChatDtoFilter = z.infer<typeof d.ChatDtoFilter>;
export type TChatDtoUpdate = z.infer<typeof d.ChatDtoUpdate>;

// Controller DTOs
export type TChatDtoById = z.infer<typeof d.ChatDtoById>;
export type TChatDtoByEntityId = z.infer<typeof d.ChatDtoByEntityId>;
export type TChatDtoByUserId = z.infer<typeof d.ChatDtoByUserId>;

// Public DTOs
export type TChatDtoPublic = z.infer<typeof d.ChatDtoPublic>;
