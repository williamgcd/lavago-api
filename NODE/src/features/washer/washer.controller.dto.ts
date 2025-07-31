import { z } from "zod";
import { washerDTO } from "./washer.dto";

export const washerCreateDTO = washerDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TWasherCreateDTO = z.infer<typeof washerCreateDTO>;

export const washerFindQueryDTO = washerDTO.pick({
    userId: true,
    rating: true,
    baseLat: true,
    baseLng: true,
}).partial();
export type TWasherFindQueryDTO = z.infer<typeof washerFindQueryDTO>;

export const washerUpdateDTO = washerDTO.partial().omit({ 
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TWasherUpdateDTO = z.infer<typeof washerUpdateDTO>;
