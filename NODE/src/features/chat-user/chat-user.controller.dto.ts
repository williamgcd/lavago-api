import { z } from "zod";
import { chatUserDTO } from "./chat-user.dto";

export const chatUserCreateDTO = chatUserDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TChatUserCreateDTO = z.infer<typeof chatUserCreateDTO>;

export const chatUserFindQueryDTO = chatUserDTO.pick({
    chatId: true,
    userId: true,
}).partial();
export type TChatUserFindQueryDTO = z.infer<typeof chatUserFindQueryDTO>;

export const chatUserUpdateDTO = chatUserDTO.partial().omit({ 
    id: true,
    chatId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TChatUserUpdateDTO = z.infer<typeof chatUserUpdateDTO>;
