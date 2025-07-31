import { z } from "zod";

export const geofencingCheckDTO = z.object({
    id: z.string(),
    zip: z.string(),
    isSupported: z.boolean().nullable(),
    washerCount: z.number(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TGeofencingCheckDTO = z.infer<typeof geofencingCheckDTO>;
