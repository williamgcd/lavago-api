import { z } from 'zod';
import { addressDTO } from './address.dto';

export const addressCreateDTO = addressDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TAddressCreateDTO = z.infer<typeof addressCreateDTO>;

export const addressFindQueryDTO = addressDTO.pick({
    userId: true,
    city: true,
    state: true,
    zip: true,
}).partial();
export type TAddressFindQueryDTO = z.infer<typeof addressFindQueryDTO>;

export const addressUpdateDTO = addressDTO.partial().extend({
    userId: z.string().optional(),
});
export type TAddressUpdateDTO = z.infer<typeof addressUpdateDTO>; 