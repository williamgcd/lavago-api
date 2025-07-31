import { z } from "zod";
import { chatDTO } from "./chat.dto";

export const chatCreateDTO = chatDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TChatCreateDTO = z.infer<typeof chatCreateDTO>;

export const chatFindQueryDTO = chatDTO.pick({
    status: true,
    object: true,
    objectId: true,
}).partial();
export type TChatFindQueryDTO = z.infer<typeof chatFindQueryDTO>;

export const chatUpdateDTO = chatDTO.partial().omit({ 
    id: true,
    object: true,
    objectId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TChatUpdateDTO = z.infer<typeof chatUpdateDTO>;
