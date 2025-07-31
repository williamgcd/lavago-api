import { z } from "zod";

export const washerHourDTO = z.object({
    id: z.string(),
    userId: z.string(),
    dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    hourStart: z.date(),
    hourEnd: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TWasherHourDTO = z.infer<typeof washerHourDTO>;
