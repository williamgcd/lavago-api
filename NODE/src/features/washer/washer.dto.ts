import { z } from "zod";

export const washerDTO = z.object({
    id: z.string(),
    userId: z.string(),
    rating: z.number(),
    lastLat: z.number().nullable(),
    lastLng: z.number().nullable(),
    lastSeenAt: z.date().nullable(),
    baseLat: z.number().nullable(),
    baseLng: z.number().nullable(),
    baseRadius: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TWasherDTO = z.infer<typeof washerDTO>;
