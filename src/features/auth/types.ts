import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TAuthDto = z.infer<typeof d.AuthDto>;

// Default CRUD DTOs
export type TAuthDtoCreate = z.infer<typeof d.AuthDtoCreate>;

// Controller DTOs

// Public DTOs
export type TAuthDtoPublic = z.infer<typeof d.AuthDtoPublic>;
