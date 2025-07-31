import { and, count, eq, isNull, gte, lte } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TWasher, washers } from "./washer.schema";
import { TWasherFindQueryDTO } from "./washer.controller.dto";

export const washerRepository = {
    create: async (data: Omit<Partial<TWasher>, 'id'>): Promise<TWasher> => {
        const washer = {...data } as TWasher;

        try {
            const result = await db.insert(washers).values(washer).returning();
            if (result.length === 0) {
                throw new Error('Washer not created');
            }
            return result[0] as TWasher;
        } catch (err) {
            console.error('washerRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await washerRepository.getById(id);
            await db.update(washers)
                .set({ deletedAt: new Date() })
                .where(eq(washers.id, id));
        } catch (err) {
            console.error('washerRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TWasherFindQueryDTO,
    ): Promise<{ data: TWasher[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(washers.deletedAt)
            ];

            if (query?.rating) {
                where.push(eq(washers.rating, query.rating));
            }
            if (query?.baseLat) {
                where.push(eq(washers.baseLat, query.baseLat));
            }
            if (query?.baseLng) {
                where.push(eq(washers.baseLng, query.baseLng));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(washers)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(washers)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TWasher[],
                total: Number(total)
            };
        } catch (err) {
            console.error('washerRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TWasher> => {
        try {
            const result = await db
                .select()
                .from(washers)
                .where(and(
                    eq(washers.id, id),
                    isNull(washers.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Washer not found');
            }
            return result[0] as TWasher;
        } catch (err) {
            console.error('washerRepository.getById', err);
            throw err;
        }
    },

    getByUserId: async (userId: string): Promise<TWasher> => {
        try {
            const result = await db
                .select()
                .from(washers)
                .where(and(
                    eq(washers.userId, userId),
                    isNull(washers.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Washer not found');
            }
            return result[0] as TWasher;
        } catch (err) {
            console.error('washerRepository.getByUserId', err);
            throw err;
        }
    },

    updateById: async (id: string, washer: Partial<TWasher>): Promise<TWasher> => {
        try {
            const updateData: Partial<TWasher> = Object.fromEntries(
                Object.entries(washer).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return washerRepository.getById(id);
            }

            const result = await db.update(washers)
                .set(updateData)
                .where(eq(washers.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Washer not found');
            }
            return result[0] as TWasher;
        } catch (err) {
            console.error('washerRepository.updateById', err);
            throw err;
        }
    }
};
