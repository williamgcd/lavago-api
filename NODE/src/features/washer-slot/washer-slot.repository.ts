import { and, count, eq, isNull, gte, lte } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TWasherSlot, washerSlots } from "./washer-slot.schema";
import { TWasherSlotFindQueryDTO } from "./washer-slot.controller.dto";

export const washerSlotRepository = {
    create: async (data: Omit<Partial<TWasherSlot>, 'id'>): Promise<TWasherSlot> => {
        const washerSlot = {...data } as TWasherSlot;

        // TODO: Check if the washer slot is already created for the same user and date range

        try {
            const result = await db.insert(washerSlots).values(washerSlot).returning();
            if (result.length === 0) {
                throw new Error('Washer slot not created');
            }
            return result[0] as TWasherSlot;
        } catch (err) {
            console.error('washerSlotRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await washerSlotRepository.getById(id);
            await db.update(washerSlots)
                .set({ deletedAt: new Date() })
                .where(eq(washerSlots.id, id));
        } catch (err) {
            console.error('washerSlotRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TWasherSlotFindQueryDTO,
    ): Promise<{ data: TWasherSlot[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(washerSlots.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(washerSlots.userId, query.userId));
            }
            if (query?.type) {
                where.push(eq(washerSlots.type, query.type));
            }
            if (query?.isAvailable !== undefined) {
                where.push(eq(washerSlots.isAvailable, query.isAvailable));
            }
            if (query?.intervalStart) {
                where.push(gte(washerSlots.intervalStart, query.intervalStart));
            }
            if (query?.intervalEnd) {
                where.push(lte(washerSlots.intervalStart, query.intervalEnd));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(washerSlots)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(washerSlots)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TWasherSlot[],
                total: Number(total)
            };
        } catch (err) {
            console.error('washerSlotRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TWasherSlot> => {
        try {
            const result = await db
                .select()
                .from(washerSlots)
                .where(and(
                    eq(washerSlots.id, id),
                    isNull(washerSlots.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Washer slot not found');
            }
            return result[0] as TWasherSlot;
        } catch (err) {
            console.error('washerSlotRepository.getById', err);
            throw err;
        }
    },
    
    updateById: async (id: string, washerSlot: Partial<TWasherSlot>): Promise<TWasherSlot> => {
        try {
            const updateData: Partial<TWasherSlot> = Object.fromEntries(
                Object.entries(washerSlot).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return washerSlotRepository.getById(id);
            }

            const result = await db.update(washerSlots)
                .set(updateData)
                .where(eq(washerSlots.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Washer slot not found');
            }
            return result[0] as TWasherSlot;
        } catch (err) {
            console.error('washerSlotRepository.updateById', err);
            throw err;
        }
    }
};
