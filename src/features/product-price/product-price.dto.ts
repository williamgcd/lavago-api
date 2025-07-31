import { z } from "zod";

export const productPriceDTO = z.object({
    id: z.string(),
    productId: z.string(),
    vehicleType: z.enum(['car', 'suv', 'truck', 'motorcycle']),
    price: z.number(),
    washerQuota: z.number(),
    traineeQuota: z.number(),
    duration: z.number(),
    durationEstimate: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TProductPriceDTO = z.infer<typeof productPriceDTO>;
