import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TWasherDto = z.infer<typeof d.WasherDto>;

// Default CRUD DTOs
export type TWasherDtoCreate = z.infer<typeof d.WasherDtoCreate>;
export type TWasherDtoDelete = z.infer<typeof d.WasherDtoDelete>;
export type TWasherDtoFilter = z.infer<typeof d.WasherDtoFilter>;
export type TWasherDtoUpdate = z.infer<typeof d.WasherDtoUpdate>;

// Controller DTOs
export type TWasherDtoById = z.infer<typeof d.WasherDtoById>;

// Public DTOs
export type TWasherDtoPublic = z.infer<typeof d.WasherDtoPublic>;
