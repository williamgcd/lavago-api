import { z } from "zod";

export const productDTO = z.object({
    id: z.string(),

    mode: z.enum(['REMOTE', 'CARWASH']),
    
    name: z.string(),
    description: z.string().nullable(),
    
    price: z.number(),
    washerQuota: z.number(),
    traineeQuota: z.number(),
    
    duration: z.number(),
    durationEstimate: z.string(),

    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TProductDTO = z.infer<typeof productDTO>;
