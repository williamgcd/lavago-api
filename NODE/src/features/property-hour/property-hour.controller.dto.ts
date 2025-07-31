import { z } from "zod";
import { propertyHourDTO } from "./property-hour.dto";

export const propertyHourCreateDTO = propertyHourDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TPropertyHourCreateDTO = z.infer<typeof propertyHourCreateDTO>;

export const propertyHourFindQueryDTO = propertyHourDTO.pick({
    propertyId: true,
    dayOfWeek: true,
}).partial();
export type TPropertyHourFindQueryDTO = z.infer<typeof propertyHourFindQueryDTO>;

export const propertyHourGetByPropertyIdAndDayDTO = propertyHourDTO.pick({
    propertyId: true,
    dayOfWeek: true,
});
export type TPropertyHourGetByPropertyIdAndDayDTO = z.infer<typeof propertyHourGetByPropertyIdAndDayDTO>;

export const propertyHourUpdateDTO = propertyHourDTO.partial().omit({ 
    propertyId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TPropertyHourUpdateDTO = z.infer<typeof propertyHourUpdateDTO>;
