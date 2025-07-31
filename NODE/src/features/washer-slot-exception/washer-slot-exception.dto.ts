import { z } from "zod";
import { dateUtils } from "@/utils/date";
import { WASHER_SLOT_TYPE } from "../washer-slot/washer-slot.schema";

export const washerSlotExceptionDTO = z.object({
    id: z.string(),
    userId: z.string(),
    isAvailable: z.boolean(),

    intervalStart: z.string().transform((arg) => {
        return dateUtils.getDateFromParam(arg, true);
    }).optional(),
    intervalEnd: z.string().transform((arg) => {
        return dateUtils.getDateFromParam(arg, false);
    }).optional(),
    
    type: z.enum(WASHER_SLOT_TYPE).default('custom'),
    
    createdBy: z.string(),
    
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TWasherSlotExceptionDTO = z.infer<typeof washerSlotExceptionDTO>;