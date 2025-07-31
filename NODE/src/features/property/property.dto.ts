import { z } from "zod";
import { propertyHourDTO } from "../property-hour/property-hour.dto";

export const propertyDTO = z.object({
    id: z.string(),
    
    name: z.string(),
    description: z.string().nullable(),
    
    street: z.string(),
    number: z.string(),
    complement: z.string().nullable(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zip: z.string(),
    
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    
    isSupported: z.boolean().nullable(),
    
    agreedDiscount: z.number(),
    agreedCashbackPerBooking: z.number(),

    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TPropertyDTO = z.infer<typeof propertyDTO>;

export const propertyPublicDTO = propertyDTO.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
}).extend({
    hours: z.array(propertyHourDTO.pick({
        dayOfWeek: true,
        hourStart: true,
        hourEnd: true,
    })),
});
export type TPropertyPublicDTO = z.infer<typeof propertyPublicDTO>;
