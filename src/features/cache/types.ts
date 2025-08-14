import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TCacheDto = z.infer<typeof d.CacheDto>;

// Default CRUD DTOs
export type TCacheDtoCreate = z.infer<typeof d.CacheDtoCreate>;
export type TCacheDtoDelete = z.infer<typeof d.CacheDtoDelete>;
export type TCacheDtoFilter = z.infer<typeof d.CacheDtoFilter>;
export type TCacheDtoUpdate = z.infer<typeof d.CacheDtoUpdate>;
export type TCacheDtoUpsert = z.infer<typeof d.CacheDtoUpsert>;
export type TCacheDtoCheck = z.infer<typeof d.CacheDtoCheck>;

// Controller DTOs
export type TCacheDtoById = z.infer<typeof d.CacheDtoById>;
export type TCacheDtoByEntityKey = z.infer<typeof d.CacheDtoByEntityKey>;

// Public DTOs
export type TCacheDtoPublic = z.infer<typeof d.CacheDtoPublic>; 