import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TVehicleDto = z.infer<typeof d.VehicleDto>;

// Default CRUD DTOs
export type TVehicleDtoCreate = z.infer<typeof d.VehicleDtoCreate>;
export type TVehicleDtoDelete = z.infer<typeof d.VehicleDtoDelete>;
export type TVehicleDtoFilter = z.infer<typeof d.VehicleDtoFilter>;
export type TVehicleDtoUpdate = z.infer<typeof d.VehicleDtoUpdate>;

// Controller DTOs
export type TVehicleDtoById = z.infer<typeof d.VehicleDtoById>;

// Public DTOs
export type TVehicleDtoPublic = z.infer<typeof d.VehicleDtoPublic>;
