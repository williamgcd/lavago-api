import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TPlanDto = z.infer<typeof d.PlanDto>;

// Default CRUD DTOs
export type TPlanDtoCreate = z.infer<typeof d.PlanDtoCreate>;
export type TPlanDtoDelete = z.infer<typeof d.PlanDtoDelete>;
export type TPlanDtoFilter = z.infer<typeof d.PlanDtoFilter>;
export type TPlanDtoUpdate = z.infer<typeof d.PlanDtoUpdate>;

// Controller DTOs
export type TPlanDtoById = z.infer<typeof d.PlanDtoById>;
export type TPlanDtoByCode = z.infer<typeof d.PlanDtoByCode>;

// Public DTOs
export type TPlanDtoPublic = z.infer<typeof d.PlanDtoPublic>;
