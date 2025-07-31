import { z } from "zod";
import { washerHourDTO } from "./washer-hour.dto";
import { WASHER_HOUR_DAY_OF_WEEK } from "./washer-hour.schema";

export const washerHourCreateDTO = washerHourDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TWasherHourCreateDTO = z.infer<typeof washerHourCreateDTO>;

export const washerHourFindQueryDTO = washerHourDTO.pick({
    userId: true,
    dayOfWeek: true,
}).partial();
export type TWasherHourFindQueryDTO = z.infer<typeof washerHourFindQueryDTO>;

export const washerHourGetByUserIdAndDayOfWeekDTO = z.object({
    userId: z.string(),
    dayOfWeek: z.enum(WASHER_HOUR_DAY_OF_WEEK),
});
export type TWasherHourGetByUserIdAndDayOfWeekDTO = z.infer<typeof washerHourGetByUserIdAndDayOfWeekDTO>;

export const washerHourUpdateDTO = washerHourDTO.partial().omit({ 
    userId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TWasherHourUpdateDTO = z.infer<typeof washerHourUpdateDTO>;
