import { and, count, eq, isNull } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TReferral, referrals } from "./referral.schema";
import { TReferralFindQueryDTO } from "./referral.controller.dto";

export const referralRepository = {
    create: async (data: Omit<Partial<TReferral>, 'id'>): Promise<TReferral> => {
        const referral = {...data } as TReferral;

        try {
            const result = await db.insert(referrals).values(referral).returning();
            if (result.length === 0) {
                throw new Error('Referral not created');
            }
            return result[0] as TReferral;
        } catch (err) {
            console.error('referralRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await referralRepository.getById(id);
            await db.delete(referrals).where(eq(referrals.id, id));
        } catch (err) {
            console.error('referralRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TReferralFindQueryDTO,
    ): Promise<{ data: TReferral[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(referrals.deletedAt)
            ];

            if (query?.referrerUserId) {
                where.push(eq(referrals.referrerUserId, query.referrerUserId));
            }
            if (query?.referredUserId) {
                where.push(eq(referrals.referredUserId, query.referredUserId));
            }
            if (query?.status) {
                where.push(eq(referrals.status, query.status));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(referrals)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(referrals)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TReferral[],
                total: Number(total)
            };
        } catch (err) {
            console.error('referralRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TReferral> => {
        try {
            const result = await db
                .select()
                .from(referrals)
                .where(and(
                    eq(referrals.id, id),
                    isNull(referrals.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Referral not found');
            }
            return result[0] as TReferral;
        } catch (err) {
            console.error('referralRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, referral: Partial<TReferral>): Promise<TReferral> => {
        try {
            const updateData: Partial<TReferral> = Object.fromEntries(
                Object.entries(referral).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return referralRepository.getById(id);
            }

            const result = await db.update(referrals)
                .set(updateData)
                .where(eq(referrals.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Referral not found');
            }
            return result[0] as TReferral;
        } catch (err) {
            console.error('referralRepository.updateById', err);
            throw err;
        }
    }
};
