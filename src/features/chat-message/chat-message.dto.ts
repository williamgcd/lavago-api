import { z } from "zod";

export const chatMessageDTO = z.object({
    id: z.string(),
    chatId: z.string(),
    type: z.enum(['USER', 'SYSTEM']),
    actor: z.string(),
    content: z.string(),
    createdBy: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TChatMessageDTO = z.infer<typeof chatMessageDTO>;
