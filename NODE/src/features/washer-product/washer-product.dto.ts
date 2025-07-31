import { z } from "zod";

export const washerProductDTO = z.object({
    id: z.string(),
    userId: z.string(),
    productId: z.string(),

    isPreferred: z.boolean(),
    
    lastUsedAt: z.date().nullable(),
    
    trainedBy: z.string().nullable(),
    trainedAt: z.date().nullable(),
    
    licensedBy: z.string().nullable(),
    licensedAt: z.date().nullable(),
    
    avgDuration: z.number(),
    avgRating: z.number(),

    experienceLevel: z.number(),
    
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TWasherProductDTO = z.infer<typeof washerProductDTO>; 