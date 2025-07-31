import { z } from "zod";
import { chatMessageDTO } from "./chat-message.dto";

export const chatMessageCreateDTO = chatMessageDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TChatMessageCreateDTO = z.infer<typeof chatMessageCreateDTO>;

export const chatMessageFindQueryDTO = chatMessageDTO.pick({
    chatId: true,
    type: true,
    actor: true,
    createdBy: true,
}).partial();
export type TChatMessageFindQueryDTO = z.infer<typeof chatMessageFindQueryDTO>;

export const chatMessageUpdateDTO = chatMessageDTO.partial().omit({ 
    id: true,
    chatId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TChatMessageUpdateDTO = z.infer<typeof chatMessageUpdateDTO>;
