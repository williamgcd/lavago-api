import { z } from "zod";
import { COUPON_DISCOUNT_TYPE } from "./coupon.schema";

export const couponDTO = z.object({
    id: z.string(),
    code: z.string(),

    discountType: z.enum(COUPON_DISCOUNT_TYPE),
    discountValue: z.number(),
    
    beginsAt: z.date().nullable(),
    expiresAt: z.date().nullable(),
    
    usageLimit: z.number(),
    usageCount: z.number(),
    usageUserId: z.string().nullable(),
    
    createdBy: z.string(),
    
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
});
export type TCouponDTO = z.infer<typeof couponDTO>;
