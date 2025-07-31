import { z } from "zod";

export const geofencingCityDTO = z.object({
    id: z.string(),
    identifier: z.string(),
    isSupported: z.boolean().nullable(),
    zipRangeStart: z.string(),
    zipRangeEnd: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TGeofencingCityDTO = z.infer<typeof geofencingCityDTO>;
