import { z } from "zod";
import { dateUtils } from "@/utils/date";
import { WASHER_SLOT_TYPE } from "./washer-slot.schema";

export const washerSlotDTO = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),

    isAvailable: z.boolean().optional(),
    
    intervalStart: z.string().transform((arg) => {
        return dateUtils.getDateFromParam(arg, true);
    }).optional(),
    intervalEnd: z.string().transform((arg) => {
        return dateUtils.getDateFromParam(arg, false);
    }).optional(),
    
    type: z.enum(WASHER_SLOT_TYPE).optional(),

    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});

export type TWasherSlotDTO = z.infer<typeof washerSlotDTO>;
