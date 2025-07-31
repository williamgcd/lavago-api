import { eventBus } from "@/libs/event-bus-client";

import { TWasherSlotExceptionFindQueryDTO } from "./washer-slot-exception.controller.dto";
import { TWasherSlotExceptionEvents } from "./washer-slot-exception.events";
import { washerSlotExceptionRepository } from "./washer-slot-exception.repository";
import { type TWasherSlotException } from "./washer-slot-exception.schema";

export const washerSlotExceptionService = {
    create: async (data: Omit<Partial<TWasherSlotException>, 'id'>): Promise<TWasherSlotException> => {
        const result = await washerSlotExceptionRepository.create(data);
        eventBus.emit<TWasherSlotExceptionEvents['washer-slot-exception.created']>('washer-slot-exception.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { userId } = await washerSlotExceptionRepository.getById(id);
        await washerSlotExceptionRepository.deleteById(id);
        eventBus.emit<TWasherSlotExceptionEvents['washer-slot-exception.deleted']>('washer-slot-exception.deleted', { id, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TWasherSlotExceptionFindQueryDTO
    ): Promise<{ data: TWasherSlotException[], total: number }> => {
        return washerSlotExceptionRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
        query?: Omit<TWasherSlotExceptionFindQueryDTO, 'userId'>
    ): Promise<{ data: TWasherSlotException[], total: number }> => {
        return washerSlotExceptionRepository.find(limit, page, { userId, ...query });
    },

    getById: async (id: string): Promise<TWasherSlotException> => {
        return washerSlotExceptionRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TWasherSlotException>): Promise<TWasherSlotException> => {
        const prev = await washerSlotExceptionRepository.getById(id);
        const result = await washerSlotExceptionRepository.updateById(id, data);
        eventBus.emit<TWasherSlotExceptionEvents['washer-slot-exception.updated']>('washer-slot-exception.updated', { prev, next: result });
        return result;
    }
};
