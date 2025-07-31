import { z } from "zod";
import { PROPERTY_HOUR_DAY_OF_WEEK } from "./property-hour.schema";

export const propertyHourDTO = z.object({
    id: z.string(),
    propertyId: z.string(),
    dayOfWeek: z.enum(PROPERTY_HOUR_DAY_OF_WEEK),
    hourStart: z.date(),
    hourEnd: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TPropertyHourDTO = z.infer<typeof propertyHourDTO>;