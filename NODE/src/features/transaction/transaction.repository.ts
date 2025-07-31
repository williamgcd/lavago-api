import { and, count, eq, isNull, like } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TTransaction, transactions } from "./transaction.schema";
import { TTransactionFindQueryDTO } from "./transaction.controller.dto";

export const transactionRepository = {
    create: async (data: Omit<Partial<TTransaction>, 'id'>): Promise<TTransaction> => {
        const transaction = {...data } as TTransaction;

        try {
            const result = await db.insert(transactions).values(transaction).returning();
            if (result.length === 0) {
                throw new Error('Transaction not created');
            }
            return result[0] as TTransaction;
        } catch (err) {
            console.error('transactionRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await transactionRepository.getById(id);
            await db.delete(transactions).where(eq(transactions.id, id));
        } catch (err) {
            console.error('transactionRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TTransactionFindQueryDTO,
    ): Promise<{ data: TTransaction[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [];

            if (query?.userId) {
                where.push(eq(transactions.userId, query.userId));
            }
            if (query?.type) {
                where.push(eq(transactions.type, query.type));
            }
            if (query?.status) {
                where.push(eq(transactions.status, query.status));
            }
            if (query?.object) {
                where.push(like(transactions.object, `${query.object}%`));
            }
            if (query?.object && query?.objectId) {
                where.push(eq(transactions.objectId, query.objectId));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(transactions)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(transactions)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TTransaction[],
                total: Number(total)
            };
        } catch (err) {
            console.error('transactionRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TTransaction> => {
        try {
            const result = await db
                .select()
                .from(transactions)
                .where(eq(transactions.id, id))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Transaction not found');
            }
            return result[0] as TTransaction;
        } catch (err) {
            console.error('transactionRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, transaction: Partial<TTransaction>): Promise<TTransaction> => {
        try {
            const updateData: Partial<TTransaction> = Object.fromEntries(
                Object.entries(transaction).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return transactionRepository.getById(id);
            }

            const result = await db.update(transactions)
                .set(updateData)
                .where(eq(transactions.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Transaction not found');
            }
            return result[0] as TTransaction;
        } catch (err) {
            console.error('transactionRepository.updateById', err);
            throw err;
        }
    }
};
