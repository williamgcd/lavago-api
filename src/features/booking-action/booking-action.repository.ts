import { and, count, eq, isNull } from "drizzle-orm";

import { PAGINATION } from "@/constants/pagination";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TBookingAction, bookingActions } from "./booking-action.schema";

export const bookingActionRepository = {
    create: async (data: Omit<Partial<TBookingAction>, 'id'>): Promise<TBookingAction> => {
        const bookingAction = { ...data } as TBookingAction;

        try {
            const result = await db.insert(bookingActions).values(bookingAction).returning();
            if (result.length === 0) {
                throw new Error('Booking action not created');
            }
            return result[0] as TBookingAction;
        } catch (err) {
            console.error('bookingActionRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            const result = await bookingActionRepository.getById(id);
            await db.delete(bookingActions).where(eq(bookingActions.id, result.id));
        } catch (err) {
            console.error('bookingActionRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: Partial<Pick<TBookingAction, 'bookingId' | 'createdBy'>>,
    ): Promise<{ data: TBookingAction[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [];

            if (query?.bookingId) {
                where.push(eq(bookingActions.bookingId, query.bookingId));
            }
            if (query?.createdBy) {
                where.push(eq(bookingActions.createdBy, query.createdBy));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(bookingActions)
                .where(where.length > 0 ? and(...where) : undefined);
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(bookingActions)
                .where(where.length > 0 ? and(...where) : undefined)
                .limit(limit)
                .offset(offset);
            return {
                data: result as TBookingAction[],
                total: Number(total)
            };
        } catch (err) {
            console.error('bookingActionRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TBookingAction> => {
        try {
            const result = await db
                .select()
                .from(bookingActions)
                .where(eq(bookingActions.id, id))
                .limit(1);
            if (!result || result.length === 0) {
                throwRecordNotFound('Booking action not found');
            }
            return result[0] as TBookingAction;
        } catch (err) {
            console.error('bookingActionRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, bookingAction: Partial<TBookingAction>): Promise<TBookingAction> => {
        try {
            // Build updateData object only with defined values;
            const updateData: Partial<TBookingAction> = Object.fromEntries(
                Object.entries(bookingAction).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return bookingActionRepository.getById(id);
            }

            // Fields that are not allowed to be updated
            delete updateData.bookingId;

            const result = await db.update(bookingActions)
                .set(updateData)
                .where(eq(bookingActions.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Booking action not found');
            }
            return result[0] as TBookingAction;
        } catch (err) {
            console.error('bookingActionRepository.updateById', err);
            throw err;
        }
    }
};
