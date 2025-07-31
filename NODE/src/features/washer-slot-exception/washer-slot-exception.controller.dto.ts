import { z } from "zod";
import { washerSlotExceptionDTO } from "./washer-slot-exception.dto";
import { dateUtils } from "@/utils/date";

export const washerSlotExceptionCreateDTO = washerSlotExceptionDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type TWasherSlotExceptionCreateDTO = z.infer<typeof washerSlotExceptionCreateDTO>;

export const washerSlotExceptionFindQueryDTO = washerSlotExceptionDTO.pick({
    userId: true,
    type: true,
    isAvailable: true,
    intervalStart: true,
    intervalEnd: true,
    createdBy: true,
}).extend({
    intervalStart: z.string().transform((arg) => {
        return dateUtils.getDateFromParam(arg, true);
    }).optional(),
    intervalEnd: z.string().transform((arg) => {
        return dateUtils.getDateFromParam(arg, false);
    }).optional(),
}).partial();
export type TWasherSlotExceptionFindQueryDTO = z.infer<typeof washerSlotExceptionFindQueryDTO>;

export const washerSlotExceptionUpdateDTO = washerSlotExceptionDTO.partial().omit({ 
    userId: true, 
    createdBy: true 
});
export type TWasherSlotExceptionUpdateDTO = z.infer<typeof washerSlotExceptionUpdateDTO>;
