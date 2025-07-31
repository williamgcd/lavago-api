import { eventBus } from "@/libs/event-bus-client";

import { TPropertyHourFindQueryDTO } from "./property-hour.controller.dto";
import { TPropertyHourEvents } from "./property-hour.events";
import { propertyHourRepository } from "./property-hour.repository";
import { TPropertyHourDayOfWeek, type TPropertyHour } from "./property-hour.schema";
import { PAGINATION } from "@/constants";

export const propertyHourService = {
    create: async (data: Omit<Partial<TPropertyHour>, 'id'>): Promise<TPropertyHour> => {
        const result = await propertyHourRepository.create(data);
        eventBus.emit<TPropertyHourEvents['property-hour.created']>('property-hour.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { propertyId } = await propertyHourRepository.getById(id);
        await propertyHourRepository.deleteById(id);
        eventBus.emit<TPropertyHourEvents['property-hour.deleted']>('property-hour.deleted', { id, propertyId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TPropertyHourFindQueryDTO
    ): Promise<{ data: TPropertyHour[], total: number }> => {
        return propertyHourRepository.find(limit, page, query);
    },

    findByPropertyId: async (
        propertyId: string
    ): Promise<{ data: TPropertyHour[], total: number }> => {
        const limit = PAGINATION.DEFAULT_LIMIT_MAX;
        return propertyHourRepository.find(limit, 1, { propertyId });
    },

    getById: async (id: string): Promise<TPropertyHour> => {
        return propertyHourRepository.getById(id);
    },

    getByPropertyIdAndDay: async (
        propertyId: string,
        dayOfWeek: TPropertyHourDayOfWeek
    ): Promise<TPropertyHour> => {
        return propertyHourRepository.getByPropertyIdAndDay(propertyId, dayOfWeek);
    },

    updateById: async (id: string, data: Partial<TPropertyHour>): Promise<TPropertyHour> => {
        const prev = await propertyHourRepository.getById(id);
        const result = await propertyHourRepository.updateById(id, data);
        eventBus.emit<TPropertyHourEvents['property-hour.updated']>('property-hour.updated', { prev, next: result });
        return result;
    }
};
