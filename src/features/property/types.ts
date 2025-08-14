import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TPropertyDto = z.infer<typeof d.PropertyDto>;

// Default CRUD DTOs
export type TPropertyDtoCreate = z.infer<typeof d.PropertyDtoCreate>;
export type TPropertyDtoDelete = z.infer<typeof d.PropertyDtoDelete>;
export type TPropertyDtoFilter = z.infer<typeof d.PropertyDtoFilter>;
export type TPropertyDtoUpdate = z.infer<typeof d.PropertyDtoUpdate>;

// Controller DTOs
export type TPropertyDtoById = z.infer<typeof d.PropertyDtoById>;

// Public DTOs
export type TPropertyDtoPublic = z.infer<typeof d.PropertyDtoPublic>; 