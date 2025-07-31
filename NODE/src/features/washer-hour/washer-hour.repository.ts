import { and, count, eq, isNull } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TWasherHour, TWasherHourDayOfWeek, washerHours } from "./washer-hour.schema";
import { TWasherHourFindQueryDTO } from "./washer-hour.controller.dto";

export const washerHourRepository = {
    create: async (data: Omit<Partial<TWasherHour>, 'id'>): Promise<TWasherHour> => {
        const washerHour = {...data } as TWasherHour;

        // TODO: Check if the washer hour is already created for the same user and day of week
        try {
            const { userId, dayOfWeek } = washerHour;
            await washerHourRepository.getByUserIdAndDayOfWeek(userId, dayOfWeek);
            throwRecordDuplicated('Washer hour already exists for this user and day of week');
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('washerHourRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(washerHours).values(washerHour).returning();
            if (result.length === 0) {
                throw new Error('Washer hour not created');
            }
            return result[0] as TWasherHour;
        } catch (err) {
            console.error('washerHourRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await washerHourRepository.getById(id);
            await db.update(washerHours)
                .set({ deletedAt: new Date() })
                .where(eq(washerHours.id, id));
        } catch (err) {
            console.error('washerHourRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TWasherHourFindQueryDTO,
    ): Promise<{ data: TWasherHour[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(washerHours.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(washerHours.userId, query.userId));
            }
            if (query?.dayOfWeek) {
                where.push(eq(washerHours.dayOfWeek, query.dayOfWeek));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(washerHours)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(washerHours)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TWasherHour[],
                total: Number(total)
            };
        } catch (err) {
            console.error('washerHourRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TWasherHour> => {
        try {
            const result = await db
                .select()
                .from(washerHours)
                .where(and(
                    eq(washerHours.id, id),
                    isNull(washerHours.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Washer hour not found');
            }
            return result[0] as TWasherHour;
        } catch (err) {
            console.error('washerHourRepository.getById', err);
            throw err;
        }
    },

    getByUserIdAndDayOfWeek: async (
        userId: string,
        dayOfWeek: TWasherHourDayOfWeek
    ): Promise<TWasherHour> => {
        try {
            const result = await db
                .select()
                .from(washerHours)
                .where(and(
                    eq(washerHours.userId, userId),
                    eq(washerHours.dayOfWeek, dayOfWeek),
                    isNull(washerHours.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Washer hour not found');
            }
            return result[0] as TWasherHour;
        } catch (err) {
            console.error('washerHourRepository.getByUserIdAndDayOfWeek', err);
            throw err;
        }
    },

    updateById: async (id: string, washerHour: Partial<TWasherHour>): Promise<TWasherHour> => {
        try {
            const current = await washerHourRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TWasherHour> = Object.fromEntries(
                Object.entries(washerHour).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return washerHourRepository.getById(id);
            }

            if (updateData.dayOfWeek && updateData.dayOfWeek !== current.dayOfWeek) {
                try {
                    await washerHourRepository.getByUserIdAndDayOfWeek(current.userId, updateData.dayOfWeek);
                    throwRecordDuplicated('Washer hour already exists for this user and day of week');
                } catch (err) {
                    if (!(err instanceof RecordNotFoundError)) {
                        console.error('washerHourRepository.updateById', err);
                        throw err;
                    }
                }
            }

            const result = await db.update(washerHours)
                .set(updateData)
                .where(eq(washerHours.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Washer hour not found');
            }
            return result[0] as TWasherHour;
        } catch (err) {
            console.error('washerHourRepository.updateById', err);
            throw err;
        }
    }
};
