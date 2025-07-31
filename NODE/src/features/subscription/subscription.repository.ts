import { and, count, eq, isNull, like } from "drizzle-orm";

import { PAGINATION } from "@/constants/pagination";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TSubscription, subscriptions } from "./subscription.schema";

export const subscriptionRepository = {
    create: async (data: Omit<Partial<TSubscription>, 'id'>): Promise<TSubscription> => {
        const subscription = { ...data } as TSubscription;

        try {
            const result = await db.insert(subscriptions).values(subscription).returning();
            if (result.length === 0) {
                throw new Error('Subscription not created');
            }
            return result[0] as TSubscription;
        } catch (err) {
            console.error('subscriptionRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        try {
            const result = await subscriptionRepository.getById(id);
            if (hardDelete) {
                await db.delete(subscriptions).where(eq(subscriptions.id, result.id));
                return;
            }
            await db.update(subscriptions)
                .set({ deletedAt: new Date() })
                .where(eq(subscriptions.id, result.id));
        } catch (err) {
            console.error('subscriptionRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: Partial<Pick<TSubscription, 'userId' | 'productId' | 'vehicleId' | 'status' | 'recurrence' | 'paymentProvider'>>,
    ): Promise<{ data: TSubscription[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(subscriptions.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(subscriptions.userId, query.userId));
            }
            if (query?.productId) {
                where.push(eq(subscriptions.productId, query.productId));
            }
            if (query?.status) {
                where.push(eq(subscriptions.status, query.status));
            }
            if (query?.recurrence) {
                where.push(eq(subscriptions.recurrence, query.recurrence));
            }
            if (query?.paymentProvider) {
                where.push(eq(subscriptions.paymentProvider, query.paymentProvider));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(subscriptions)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(subscriptions)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TSubscription[],
                total: Number(total)
            };
        } catch (err) {
            console.error('subscriptionRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TSubscription> => {
        try {
            const result = await db
                .select()
                .from(subscriptions)
                .where(and(
                    eq(subscriptions.id, id),
                    isNull(subscriptions.deletedAt)
                ))
                .limit(1);
            if (!result || result.length === 0) {
                throwRecordNotFound('Subscription not found');
            }
            return result[0] as TSubscription;
        } catch (err) {
            console.error('subscriptionRepository.getById', err);
            throw err;
        }
    },

    getByUserId: async (userId: string): Promise<TSubscription[]> => {
        try {
            const result = await db
                .select()
                .from(subscriptions)
                .where(and(
                    eq(subscriptions.userId, userId),
                    isNull(subscriptions.deletedAt)
                ));
            return result as TSubscription[];
        } catch (err) {
            console.error('subscriptionRepository.getByUserId', err);
            throw err;
        }
    },

    updateById: async (id: string, subscription: Partial<TSubscription>): Promise<TSubscription> => {
        try {
            const current = await subscriptionRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TSubscription> = Object.fromEntries(
                Object.entries(subscription).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return subscriptionRepository.getById(id);
            }

            const result = await db.update(subscriptions)
                .set(updateData)
                .where(eq(subscriptions.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Subscription not found');
            }
            return result[0] as TSubscription;
        } catch (err) {
            console.error('subscriptionRepository.updateById', err);
            throw err;
        }
    }
};
