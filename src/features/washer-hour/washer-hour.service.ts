import { eventBus } from "@/libs/event-bus-client";

import { TWasherHourFindQueryDTO } from "./washer-hour.controller.dto";
import { TWasherHourEvents } from "./washer-hour.events";
import { washerHourRepository } from "./washer-hour.repository";
import { TWasherHourDayOfWeek, type TWasherHour } from "./washer-hour.schema";

export const washerHourService = {
    create: async (data: Omit<Partial<TWasherHour>, 'id'>): Promise<TWasherHour> => {
        const result = await washerHourRepository.create(data);
        eventBus.emit<TWasherHourEvents['washer-hour.created']>('washer-hour.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { userId } = await washerHourRepository.getById(id);
        await washerHourRepository.deleteById(id);
        eventBus.emit<TWasherHourEvents['washer-hour.deleted']>('washer-hour.deleted', { id, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TWasherHourFindQueryDTO
    ): Promise<{ data: TWasherHour[], total: number }> => {
        return washerHourRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
        query?: Omit<TWasherHourFindQueryDTO, 'userId'>
    ): Promise<{ data: TWasherHour[], total: number }> => {
        return washerHourRepository.find(limit, page, { userId, ...query });
    },

    getById: async (id: string): Promise<TWasherHour> => {
        return washerHourRepository.getById(id);
    },

    getByUserIdAndDayOfWeek: async (userId: string, dayOfWeek: TWasherHourDayOfWeek): Promise<TWasherHour> => {
        return washerHourRepository.getByUserIdAndDayOfWeek(userId, dayOfWeek);
    },

    updateById: async (id: string, data: Partial<TWasherHour>): Promise<TWasherHour> => {
        const prev = await washerHourRepository.getById(id);
        const result = await washerHourRepository.updateById(id, data);
        eventBus.emit<TWasherHourEvents['washer-hour.updated']>('washer-hour.updated', { prev, next: result });
        return result;
    }
};
