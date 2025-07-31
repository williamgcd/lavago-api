import { z } from "zod";
import { couponDTO } from "./coupon.dto";

export const couponCreateDTO = couponDTO.omit({
    id: true,
    code: true,
    usageCount: true,
    usageUserId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TCouponCreateDTO = z.infer<typeof couponCreateDTO>;

export const couponFindQueryDTO = couponDTO.pick({
    discountType: true,
    usageUserId: true,
    createdBy: true,
}).partial();
export type TCouponFindQueryDTO = z.infer<typeof couponFindQueryDTO>;

export const couponUpdateDTO = couponDTO.partial().omit({ 
    id: true,
    code: true,
    usageCount: true,
    usageUserId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TCouponUpdateDTO = z.infer<typeof couponUpdateDTO>;
