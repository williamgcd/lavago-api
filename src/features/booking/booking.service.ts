import { eventBus } from "@/libs/event-bus-client";

import { TBookingEvents } from "./booking.events";
import { bookingRepository } from "./booking.repository";
import { TBooking } from "./booking.schema";
import { TBookingFindQueryDTO } from "./booking.controller.dto";

export const bookingService = {
    create: async (booking: Omit<Partial<TBooking>, 'id'>): Promise<TBooking> => {
        const result = await bookingRepository.create(booking);
        eventBus.emit<TBookingEvents['booking.created']>('booking.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        await bookingRepository.deleteById(id);
        eventBus.emit<TBookingEvents['booking.deleted']>('booking.deleted', { id });
    },

    find: async (
        limit: number,
        page: number,
        query?: TBookingFindQueryDTO,
    ): Promise<{ data: TBooking[], total: number }> => {
        return bookingRepository.find(limit, page, query);
    },

    findByClientId: async (
        clientId: string,
        limit: number,
        page: number,
        query?: Omit<TBookingFindQueryDTO, 'clientId'>,
    ): Promise<{ data: TBooking[], total: number }> => {
        return bookingRepository.find(limit, page, { clientId, ...query });
    },

    findByWasherId: async (
        washerId: string,
        limit: number,
        page: number,
        query?: Omit<TBookingFindQueryDTO, 'washerId'>,
    ): Promise<{ data: TBooking[], total: number }> => {
        return bookingRepository.find(limit, page, { washerId, ...query });
    },

    getById: async (id: string): Promise<TBooking> => {
        return bookingRepository.getById(id);
    },

    updateById: async (id: string, booking: Partial<TBooking>): Promise<TBooking> => {
        const prev = await bookingRepository.getById(id);
        const next = await bookingRepository.updateById(id, booking);
        
        // Check if status changed
        if (prev.status !== next.status) {
            eventBus.emit<TBookingEvents['booking.status.changed']>('booking.status.changed', {
                prev,
                next,
                oldStatus: prev.status,
                newStatus: next.status
            });
        }
        
        eventBus.emit<TBookingEvents['booking.updated']>('booking.updated', { prev, next });
        return next;
    },

    // Status management methods
    assignWasher: async (id: string, washerId: string, washerName: string, washerPhone: string): Promise<TBooking> => {
        const booking = await bookingRepository.updateById(id, {
            washerId,
            washerName,
            washerPhone,
            status: 'scheduled'
        });
        eventBus.emit<TBookingEvents['booking.assigned']>('booking.assigned', booking);
        return booking;
    },

    startBooking: async (id: string): Promise<TBooking> => {
        const booking = await bookingRepository.updateById(id, {
            status: 'washing',
            dateItStarted: new Date()
        });
        eventBus.emit<TBookingEvents['booking.started']>('booking.started', booking);
        return booking;
    },

    completeBooking: async (id: string): Promise<TBooking> => {
        const booking = await bookingRepository.updateById(id, {
            status: 'completed',
            dateItEnded: new Date()
        });
        eventBus.emit<TBookingEvents['booking.completed']>('booking.completed', booking);
        return booking;
    },

    cancelBooking: async (id: string): Promise<TBooking> => {
        const booking = await bookingRepository.updateById(id, {
            status: 'cancelled'
        });
        eventBus.emit<TBookingEvents['booking.cancelled']>('booking.cancelled', booking);
        return booking;
    },

    rescheduleBooking: async (id: string, newDate: Date, rescheduledFromId?: string): Promise<TBooking> => {
        const booking = await bookingRepository.updateById(id, {
            status: 'rescheduled',
            date: newDate,
            rescheduledFromId
        });
        eventBus.emit<TBookingEvents['booking.rescheduled']>('booking.rescheduled', booking);
        return booking;
    },

    // Convenience methods for common status transitions
    setStatusToEnRoute: async (id: string): Promise<TBooking> => {
        return bookingRepository.updateById(id, { status: 'en_route' });
    },

    setStatusToPreparing: async (id: string): Promise<TBooking> => {
        return bookingRepository.updateById(id, { status: 'preparing' });
    },

    setStatusToFinalizing: async (id: string): Promise<TBooking> => {
        return bookingRepository.updateById(id, { status: 'finalizing' });
    },

    setStatusToFailed: async (id: string): Promise<TBooking> => {
        return bookingRepository.updateById(id, { status: 'failed' });
    },

    setStatusToUnassigned: async (id: string): Promise<TBooking> => {
        return bookingRepository.updateById(id, { status: 'unassigned' });
    },

    // Rating methods
    rateWasher: async (id: string, washerRating: number): Promise<TBooking> => {
        return bookingRepository.updateById(id, { washerRating });
    },

    rateTrainee: async (id: string, traineeRating: number): Promise<TBooking> => {
        return bookingRepository.updateById(id, { traineeRating });
    },
};
