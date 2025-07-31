import { eventBus } from "@/libs/event-bus-client";

import { TCouponFindQueryDTO } from "./coupon.controller.dto";
import { TCouponEvents } from "./coupon.events";
import { couponRepository } from "./coupon.repository";
import { type TCoupon } from "./coupon.schema";

export const couponService = {
    create: async (data: Omit<Partial<TCoupon>, 'id' | 'code' | 'usageCount' | 'usageUserId'>): Promise<TCoupon> => {
        const result = await couponRepository.create(data);
        eventBus.emit<TCouponEvents['coupon.created']>('coupon.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { code } = await couponRepository.getById(id);
        await couponRepository.deleteById(id);
        eventBus.emit<TCouponEvents['coupon.deleted']>('coupon.deleted', { id, code });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TCouponFindQueryDTO
    ): Promise<{ data: TCoupon[], total: number }> => {
        return couponRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number
    ): Promise<{ data: TCoupon[], total: number }> => {
        // Find the coupons for the user.
        const { data: usage, total: usageTotal } = await couponRepository.find(limit, page, { usageUserId: userId });
        const { data: created, total: createdTotal } = await couponRepository.find(limit, page, { createdBy: userId });
        const { data: system, total: systemTotal } = await couponRepository.find(limit, page, { createdBy: 'system' });

        return {
            data: [...usage, ...created, ...system],
            total: usageTotal + createdTotal + systemTotal,
        };
    },

    getById: async (id: string): Promise<TCoupon> => {
        return couponRepository.getById(id);
    },

    getByCode: async (code: string): Promise<TCoupon> => {
        return couponRepository.getByCode(code);
    },

    updateById: async (id: string, data: Partial<TCoupon>): Promise<TCoupon> => {
        const prev = await couponRepository.getById(id);
        const result = await couponRepository.updateById(id, data);
        eventBus.emit<TCouponEvents['coupon.updated']>('coupon.updated', { prev, next: result });
        return result;
    },

    useCoupon: async (id: string, userId: string): Promise<TCoupon> => {
        const result = await couponRepository.useCoupon(id, userId);
        eventBus.emit<TCouponEvents['coupon.used']>('coupon.used', { 
            id: result.id, 
            code: result.code, 
            userId 
        });
        return result;
    }
};
