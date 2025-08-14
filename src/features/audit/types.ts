import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TAuditDto = z.infer<typeof d.AuditDto>;

// Default CRUD DTOs
export type TAuditDtoCreate = z.infer<typeof d.AuditDtoCreate>;
export type TAuditDtoDelete = z.infer<typeof d.AuditDtoDelete>;
export type TAuditDtoFilter = z.infer<typeof d.AuditDtoFilter>;
export type TAuditDtoUpdate = z.infer<typeof d.AuditDtoUpdate>;

// Controller DTOs

// Public DTOs
export type TAuditDtoPublic = z.infer<typeof d.AuditDtoPublic>;
