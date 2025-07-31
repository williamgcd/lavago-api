import { z } from "zod";

export const chatUserDTO = z.object({
    id: z.string(),
    chatId: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TChatUserDTO = z.infer<typeof chatUserDTO>;
