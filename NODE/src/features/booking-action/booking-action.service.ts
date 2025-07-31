import { eventBus } from "@/libs/event-bus-client";

import { TBookingActionEvents } from "./booking-action.events";
import { bookingActionRepository } from "./booking-action.repository";
import { TBookingAction } from "./booking-action.schema";
import { TBookingActionFindQueryDTO } from "./booking-action.controller.dto";

export const bookingActionService = {
    create: async (bookingAction: Omit<Partial<TBookingAction>, 'id'>): Promise<TBookingAction> => {
        const result = await bookingActionRepository.create(bookingAction);
        eventBus.emit<TBookingActionEvents['booking-action.created']>('booking-action.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        await bookingActionRepository.deleteById(id);
        eventBus.emit<TBookingActionEvents['booking-action.deleted']>('booking-action.deleted', { id });
    },

    find: async (
        limit: number,
        page: number,
        query?: TBookingActionFindQueryDTO,
    ): Promise<{ data: TBookingAction[], total: number }> => {
        return bookingActionRepository.find(limit, page, query);
    },

    findByBookingId: async (
        bookingId: string,
        limit: number,
        page: number,
        query?: Omit<TBookingActionFindQueryDTO, 'bookingId'>,
    ): Promise<{ data: TBookingAction[], total: number }> => {
        return bookingActionRepository.find(limit, page, { bookingId, ...query });
    },

    getById: async (id: string): Promise<TBookingAction> => {
        return bookingActionRepository.getById(id);
    },

    updateById: async (id: string, bookingAction: Partial<TBookingAction>): Promise<TBookingAction> => {
        const prev = await bookingActionRepository.getById(id);
        const next = await bookingActionRepository.updateById(id, bookingAction);
        eventBus.emit<TBookingActionEvents['booking-action.updated']>('booking-action.updated', { prev, next });
        return next;
    },
};
