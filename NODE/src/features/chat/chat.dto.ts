import { z } from "zod";

export const chatDTO = z.object({
    id: z.string(),
    
    status: z.enum(['OPEN', 'CLOSED']),
    
    object: z.string(),
    objectId: z.string(),
    
    title: z.string(),
    description: z.string(),

    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TChatDTO = z.infer<typeof chatDTO>;
