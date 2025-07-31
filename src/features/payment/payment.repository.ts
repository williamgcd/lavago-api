import { and, count, eq, isNull } from "drizzle-orm";

import { PAGINATION } from "@/constants/pagination";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TPayment, payments } from "./payment.schema";

export const paymentRepository = {
    create: async (data: Omit<Partial<TPayment>, 'id'>): Promise<TPayment> => {
        const payment = { ...data } as TPayment;

        try {
            const result = await db.insert(payments).values(payment).returning();
            if (result.length === 0) {
                throw new Error('Payment not created');
            }
            return result[0] as TPayment;
        } catch (err) {
            console.error('paymentRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        try {
            const result = await paymentRepository.getById(id);
            if (hardDelete) {
                await db.delete(payments).where(eq(payments.id, result.id));
                return;
            }
            await db.update(payments)
                .set({ deletedAt: new Date() })
                .where(eq(payments.id, result.id));
        } catch (err) {
            console.error('paymentRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: Partial<Pick<TPayment, 'userId' | 'status' | 'paymentProvider' | 'paymentMethod' | 'currency' | 'isPreAuthorization'>>,
    ): Promise<{ data: TPayment[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(payments.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(payments.userId, query.userId));
            }
            if (query?.status) {
                where.push(eq(payments.status, query.status));
            }
            if (query?.paymentProvider) {
                where.push(eq(payments.paymentProvider, query.paymentProvider));
            }
            if (query?.paymentMethod) {
                where.push(eq(payments.paymentMethod, query.paymentMethod));
            }
            if (query?.currency) {
                where.push(eq(payments.currency, query.currency));
            }
            if (query?.isPreAuthorization !== undefined) {
                where.push(eq(payments.isPreAuthorization, query.isPreAuthorization));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(payments)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(payments)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TPayment[],
                total: Number(total)
            };
        } catch (err) {
            console.error('paymentRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TPayment> => {
        try {
            const result = await db
                .select()
                .from(payments)
                .where(and(
                    eq(payments.id, id),
                    isNull(payments.deletedAt)
                ))
                .limit(1);
            if (!result || result.length === 0) {
                throwRecordNotFound('Payment not found');
            }
            return result[0] as TPayment;
        } catch (err) {
            console.error('paymentRepository.getById', err);
            throw err;
        }
    },

    getByUserId: async (userId: string): Promise<TPayment[]> => {
        try {
            const result = await db
                .select()
                .from(payments)
                .where(and(
                    eq(payments.userId, userId),
                    isNull(payments.deletedAt)
                ));
            return result as TPayment[];
        } catch (err) {
            console.error('paymentRepository.getByUserId', err);
            throw err;
        }
    },

    getByProviderId: async (paymentProviderId: string): Promise<TPayment> => {
        try {
            const result = await db
                .select()
                .from(payments)
                .where(and(
                    eq(payments.paymentProviderId, paymentProviderId),
                    isNull(payments.deletedAt)
                ))
                .limit(1);
            if (!result || result.length === 0) {
                throwRecordNotFound('Payment not found');
            }
            return result[0] as TPayment;
        } catch (err) {
            console.error('paymentRepository.getByProviderId', err);
            throw err;
        }
    },

    updateById: async (id: string, payment: Partial<TPayment>): Promise<TPayment> => {
        try {
            const current = await paymentRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TPayment> = Object.fromEntries(
                Object.entries(payment).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return paymentRepository.getById(id);
            }

            const result = await db.update(payments)
                .set(updateData)
                .where(eq(payments.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Payment not found');
            }
            return result[0] as TPayment;
        } catch (err) {
            console.error('paymentRepository.updateById', err);
            throw err;
        }
    }
};
