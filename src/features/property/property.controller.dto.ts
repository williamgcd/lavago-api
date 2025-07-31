import { z } from "zod";
import { propertyDTO } from "./property.dto";

export const propertyCreateDTO = propertyDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TPropertyCreateDTO = z.infer<typeof propertyCreateDTO>;

export const propertyFindQueryDTO = propertyDTO.pick({
    name: true,
    city: true,
    state: true,
    country: true,
    zip: true,
    isSupported: true,
}).partial();
export type TPropertyFindQueryDTO = z.infer<typeof propertyFindQueryDTO>;

export const propertyUpdateDTO = propertyDTO.partial().omit({ 
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TPropertyUpdateDTO = z.infer<typeof propertyUpdateDTO>;
