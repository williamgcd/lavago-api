import { and, count, eq, isNull, like, gte, lte, or, is } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TCoupon, coupons } from "./coupon.schema";
import { TCouponFindQueryDTO } from "./coupon.controller.dto";

export const couponRepository = {
    create: async (data: Omit<Partial<TCoupon>, 'id' | 'code' | 'usageCount' | 'usageUserId'>): Promise<TCoupon> => {
        const coupon = {...data } as TCoupon;

        // The database will generate the code and handle the uniqueness.
        // So we don't need to check for code uniqueness here.

        try {
            const result = await db.insert(coupons).values(coupon).returning();
            if (result.length === 0) {
                throw new Error('Coupon not created');
            }
            return result[0] as TCoupon;
        } catch (err) {
            console.error('couponRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await couponRepository.getById(id);
            await db.update(coupons)
                .set({ deletedAt: new Date() })
                .where(eq(coupons.id, id));
        } catch (err) {
            console.error('couponRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TCouponFindQueryDTO,
    ): Promise<{ data: TCoupon[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(coupons.deletedAt)
            ];

            if (query?.discountType) {
                where.push(eq(coupons.discountType, query.discountType));
            }
            if (query?.usageUserId) {
                where.push(eq(coupons.usageUserId, query.usageUserId));
            }
            if (query?.createdBy) {
                where.push(eq(coupons.createdBy, query.createdBy));
                if (query.createdBy === 'system') {
                    where.push(isNull(coupons.usageUserId));
                }
            }

            const totalResult = await db
                .select({ total: count() })
                .from(coupons)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(coupons)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TCoupon[],
                total: Number(total)
            };
        } catch (err) {
            console.error('couponRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TCoupon> => {
        try {
            const result = await db
                .select()
                .from(coupons)
                .where(and(
                    eq(coupons.id, id),
                    isNull(coupons.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Coupon not found');
            }
            return result[0] as TCoupon;
        } catch (err) {
            console.error('couponRepository.getById', err);
            throw err;
        }
    },

    getByCode: async (code: string): Promise<TCoupon> => {
        try {
            const result = await db
                .select()
                .from(coupons)
                .where(and(
                    eq(coupons.code, code),
                    isNull(coupons.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Coupon not found');
            }
            return result[0] as TCoupon;
        } catch (err) {
            console.error('couponRepository.getByCode', err);
            throw err;
        }
    },

    updateById: async (id: string, coupon: Partial<TCoupon>): Promise<TCoupon> => {
        try {
            const current = await couponRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TCoupon> = Object.fromEntries(
                Object.entries(coupon).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return couponRepository.getById(id);
            }

            // Check if the code is unique
            try {
                if (coupon.code && coupon.code !== current.code) {
                    await couponRepository.getByCode(coupon.code);
                    throwRecordDuplicated('Coupon already exists');
                }
            } catch (err) {
                if (!(err instanceof RecordNotFoundError)) {
                    console.error('couponRepository.updateById', err);
                    throw err;
                }   
            }

            const result = await db.update(coupons)
                .set(updateData)
                .where(eq(coupons.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Coupon not found');
            }
            return result[0] as TCoupon;
        } catch (err) {
            console.error('couponRepository.updateById', err);
            throw err;
        }
    },

    useCoupon: async (id: string, userId: string): Promise<TCoupon> => {
        try {
            const coupon = await couponRepository.getById(id);
            
            // Check if coupon is expired
            if (coupon.expiresAt && new Date() > coupon.expiresAt) {
                throw new Error('Coupon has expired');
            }

            // Check if coupon has started
            if (coupon.beginsAt && new Date() < coupon.beginsAt) {
                throw new Error('Coupon has not started yet');
            }

            // Check usage limit
            if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
                throw new Error('Coupon usage limit reached');
            }

            // Check if user has already used this coupon
            if (coupon.usageUserId === userId) {
                throw new Error('User has already used this coupon');
            }

            const result = await db.update(coupons)
                .set({ 
                    usageCount: coupon.usageCount + 1,
                    usageUserId: userId
                })
                .where(eq(coupons.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Coupon not found');
            }
            return result[0] as TCoupon;
        } catch (err) {
            console.error('couponRepository.useCoupon', err);
            throw err;
        }
    }
};
