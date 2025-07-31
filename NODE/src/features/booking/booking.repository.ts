import { and, count, eq, isNull } from "drizzle-orm";

import { PAGINATION } from "@/constants/pagination";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TBooking, bookings } from "./booking.schema";
import { TBookingFindQueryDTO } from "./booking.controller.dto";

export const bookingRepository = {
    create: async (data: Omit<Partial<TBooking>, 'id'>): Promise<TBooking> => {
        const booking = { ...data } as TBooking;

        try {
            const result = await db.insert(bookings).values(booking).returning();
            if (result.length === 0) {
                throw new Error('Booking not created');
            }
            return result[0] as TBooking;
        } catch (err) {
            console.error('bookingRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        try {
            const result = await bookingRepository.getById(id);
            if (hardDelete) {
                await db.delete(bookings).where(eq(bookings.id, result.id));
                return;
            }
            await db.update(bookings)
                .set({ deletedAt: new Date() })
                .where(eq(bookings.id, result.id));
        } catch (err) {
            console.error('bookingRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TBookingFindQueryDTO,
    ): Promise<{ data: TBooking[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(bookings.deletedAt)
            ];

            if (query?.status) {
                where.push(eq(bookings.status, query.status));
            }
            if (query?.isSameDayBooking !== undefined) {
                where.push(eq(bookings.isSameDayBooking, query.isSameDayBooking));
            }
            if (query?.isOneTimeBooking !== undefined) {
                where.push(eq(bookings.isOneTimeBooking, query.isOneTimeBooking));
            }
            if (query?.clientId) {
                where.push(eq(bookings.clientId, query.clientId));
            }
            if (query?.washerId) {
                where.push(eq(bookings.washerId, query.washerId));
            }
            if (query?.trainerId) {
                where.push(eq(bookings.trainerId, query.trainerId));
            }
            if (query?.productId) {
                where.push(eq(bookings.productId, query.productId));
            }
            if (query?.subscriptionId) {
                where.push(eq(bookings.subscriptionId, query.subscriptionId));
            }
            if (query?.addressId) {
                where.push(eq(bookings.addressId, query.addressId));
            }
            if (query?.vehicleId) {
                where.push(eq(bookings.vehicleId, query.vehicleId));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(bookings)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(bookings)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TBooking[],
                total: Number(total)
            };
        } catch (err) {
            console.error('bookingRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TBooking> => {
        try {
            const result = await db
                .select()
                .from(bookings)
                .where(and(
                    eq(bookings.id, id),
                    isNull(bookings.deletedAt)
                ))
                .limit(1);
            if (!result || result.length === 0) {
                throwRecordNotFound('Booking not found');
            }
            return result[0] as TBooking;
        } catch (err) {
            console.error('bookingRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, booking: Partial<TBooking>): Promise<TBooking> => {
        try {
            // Build updateData object only with defined values;
            const updateData: Partial<TBooking> = Object.fromEntries(
                Object.entries(booking).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return bookingRepository.getById(id);
            }

            const result = await db.update(bookings)
                .set(updateData)
                .where(eq(bookings.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Booking not found');
            }
            return result[0] as TBooking;
        } catch (err) {
            console.error('bookingRepository.updateById', err);
            throw err;
        }
    }
};
