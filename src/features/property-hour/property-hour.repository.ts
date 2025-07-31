import { and, count, eq, isNull } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TPropertyHour, TPropertyHourDayOfWeek, propertyHours } from "./property-hour.schema";
import { TPropertyHourFindQueryDTO } from "./property-hour.controller.dto";

export const propertyHourRepository = {
    create: async (data: Omit<Partial<TPropertyHour>, 'id'>): Promise<TPropertyHour> => {
        const propertyHour = {...data } as TPropertyHour;

        // TODO: Check if the property hour is already created for the same property and day of week
        try {
            const { propertyId, dayOfWeek } = propertyHour;
            await propertyHourRepository.getByPropertyIdAndDay(propertyId, dayOfWeek);
            throwRecordDuplicated('Property hour already exists for this property and day of week');
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('propertyHourRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(propertyHours).values(propertyHour).returning();
            if (result.length === 0) {
                throw new Error('Property hour not created');
            }
            return result[0] as TPropertyHour;
        } catch (err) {
            console.error('propertyHourRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await propertyHourRepository.getById(id);
            await db.update(propertyHours)
                .set({ deletedAt: new Date() })
                .where(eq(propertyHours.id, id));
        } catch (err) {
            console.error('propertyHourRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TPropertyHourFindQueryDTO,
    ): Promise<{ data: TPropertyHour[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(propertyHours.deletedAt)
            ];

            if (query?.propertyId) {
                where.push(eq(propertyHours.propertyId, query.propertyId));
            }
            if (query?.dayOfWeek) {
                where.push(eq(propertyHours.dayOfWeek, query.dayOfWeek));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(propertyHours)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(propertyHours)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TPropertyHour[],
                total: Number(total)
            };
        } catch (err) {
            console.error('propertyHourRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TPropertyHour> => {
        try {
            const result = await db
                .select()
                .from(propertyHours)
                .where(and(
                    eq(propertyHours.id, id),
                    isNull(propertyHours.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Property hour not found');
            }
            return result[0] as TPropertyHour;
        } catch (err) {
            console.error('propertyHourRepository.getById', err);
            throw err;
        }
    },

    getByPropertyIdAndDay: async (propertyId: string, dayOfWeek: TPropertyHourDayOfWeek): Promise<TPropertyHour> => {
        try {
            const result = await db
                .select()
                .from(propertyHours)
                .where(and(
                    eq(propertyHours.propertyId, propertyId),
                    eq(propertyHours.dayOfWeek, dayOfWeek),
                    isNull(propertyHours.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Property hour not found');
            }
            return result[0] as TPropertyHour;
        } catch (err) {
            console.error('propertyHourRepository.getByPropertyIdAndDayOfWeek', err);
            throw err;
        }
    },

    updateById: async (id: string, propertyHour: Partial<TPropertyHour>): Promise<TPropertyHour> => {
        try {
            const current = await propertyHourRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TPropertyHour> = Object.fromEntries(
                Object.entries(propertyHour).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return propertyHourRepository.getById(id);
            }

            if (updateData.dayOfWeek && updateData.dayOfWeek !== current.dayOfWeek) {
                try {
                    await propertyHourRepository.getByPropertyIdAndDay(current.propertyId, updateData.dayOfWeek);
                    throwRecordDuplicated('Property hour already exists for this property and day of week');
                } catch (err) {
                    if (!(err instanceof RecordNotFoundError)) {
                        console.error('propertyHourRepository.updateById', err);
                        throw err;
                    }
                }
            }

            const result = await db.update(propertyHours)
                .set(updateData)
                .where(eq(propertyHours.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Property hour not found');
            }
            return result[0] as TPropertyHour;
        } catch (err) {
            console.error('propertyHourRepository.updateById', err);
            throw err;
        }
    }
};