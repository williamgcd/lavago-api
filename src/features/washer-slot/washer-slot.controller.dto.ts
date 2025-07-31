import { z } from "zod";
import { washerSlotDTO } from "./washer-slot.dto";

export const washerSlotCreateDTO = washerSlotDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type TWasherSlotCreateDTO = z.infer<typeof washerSlotCreateDTO>;

export const washerSlotFindQueryDTO = washerSlotDTO.pick({
    userId: true,
    type: true,
    isAvailable: true,
    intervalStart: true,
    intervalEnd: true,
}).partial();
export type TWasherSlotFindQueryDTO = z.infer<typeof washerSlotFindQueryDTO>;

export const washerSlotUpdateDTO = washerSlotDTO.partial().extend({
    userId: z.string().optional(),
});
export type TWasherSlotUpdateDTO = z.infer<typeof washerSlotUpdateDTO>;