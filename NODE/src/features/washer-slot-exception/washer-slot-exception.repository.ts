import { and, count, eq, isNull, gte, lte, like } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TWasherSlotException, washerSlotExceptions } from "./washer-slot-exception.schema";
import { TWasherSlotExceptionFindQueryDTO } from "./washer-slot-exception.controller.dto";

export const washerSlotExceptionRepository = {
    create: async (data: Omit<Partial<TWasherSlotException>, 'id'>): Promise<TWasherSlotException> => {
        const washerSlotException = {...data } as TWasherSlotException;

        // TODO: Check if the washer slot exception is already created for the same user and date range

        try {
            const result = await db.insert(washerSlotExceptions).values(washerSlotException).returning();
            if (result.length === 0) {
                throw new Error('Washer slot exception not created');
            }
            return result[0] as TWasherSlotException;
        } catch (err) {
            console.error('washerSlotExceptionRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await washerSlotExceptionRepository.getById(id);
            await db.update(washerSlotExceptions)
                .set({ deletedAt: new Date() })
                .where(eq(washerSlotExceptions.id, id));
        } catch (err) {
            console.error('washerSlotExceptionRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TWasherSlotExceptionFindQueryDTO,
    ): Promise<{ data: TWasherSlotException[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(washerSlotExceptions.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(washerSlotExceptions.userId, query.userId));
            }
            if (query?.type) {
                where.push(eq(washerSlotExceptions.type, query.type));
            }
            if (query?.isAvailable !== undefined) {
                where.push(eq(washerSlotExceptions.isAvailable, query.isAvailable));
            }
            if (query?.intervalStart) {
                where.push(gte(washerSlotExceptions.intervalStart, query.intervalStart));
            }
            if (query?.intervalEnd) {
                where.push(lte(washerSlotExceptions.intervalStart, query.intervalEnd));
            }
            if (query?.createdBy) {
                where.push(eq(washerSlotExceptions.createdBy, query.createdBy));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(washerSlotExceptions)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(washerSlotExceptions)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TWasherSlotException[],
                total: Number(total)
            };
        } catch (err) {
            console.error('washerSlotExceptionRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TWasherSlotException> => {
        try {
            const result = await db
                .select()
                .from(washerSlotExceptions)
                .where(and(
                    eq(washerSlotExceptions.id, id),
                    isNull(washerSlotExceptions.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Washer slot exception not found');
            }
            return result[0] as TWasherSlotException;
        } catch (err) {
            console.error('washerSlotExceptionRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, washerSlotException: Partial<TWasherSlotException>): Promise<TWasherSlotException> => {
        try {
            const updateData: Partial<TWasherSlotException> = Object.fromEntries(
                Object.entries(washerSlotException).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return washerSlotExceptionRepository.getById(id);
            }

            const result = await db.update(washerSlotExceptions)
                .set(updateData)
                .where(eq(washerSlotExceptions.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Washer slot exception not found');
            }
            return result[0] as TWasherSlotException;
        } catch (err) {
            console.error('washerSlotExceptionRepository.updateById', err);
            throw err;
        }
    }
};
