import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TGeofenceDto = z.infer<typeof d.GeofenceDto>;

// Default CRUD DTOs
export type TGeofenceDtoByZipCode = z.infer<typeof d.GeofenceDtoByZipCode>;

// Public types
export type TGeofenceDtoPublic = z.infer<typeof d.GeofenceDtoPublic>;
