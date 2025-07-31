import { z } from 'zod';
import { vehicleDTO } from './vehicle.dto';

export const vehicleCreateDTO = vehicleDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type TVehicleCreateDTO = z.infer<typeof vehicleCreateDTO>;

export const vehicleFindQueryDTO = vehicleDTO.pick({
    userId: true,
    type: true,
    brand: true,
    model: true,
    color: true,
}).partial();
export type TVehicleFindQueryDTO = z.infer<typeof vehicleFindQueryDTO>;

export const vehicleUpdateDTO = vehicleDTO.partial().extend({
    userId: z.string().optional(),
});
export type TVehicleUpdateDTO = z.infer<typeof vehicleUpdateDTO>;
