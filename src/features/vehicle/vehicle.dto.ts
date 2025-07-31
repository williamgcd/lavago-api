import { z } from 'zod';
import { VEHICLE_TYPES } from './vehicle.schema';

export const vehicleDTO = z.object({
    id: z.string().optional(),
    userId: z.string(),
    type: z.enum(VEHICLE_TYPES),
    plate: z.string().max(10).optional(),
    brand: z.string().max(20).optional(),
    model: z.string().max(20).optional(),
    color: z.string().max(20).optional(),
    year: z.number().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TVehicleDTO = z.infer<typeof vehicleDTO>;
