import { eventBus } from "@/libs/event-bus-client";

import { TWasherSlotFindQueryDTO } from "./washer-slot.controller.dto";
import { TWasherSlotEvents } from "./washer-slot.events";
import { washerSlotRepository } from "./washer-slot.repository";
import { type TWasherSlot } from "./washer-slot.schema";

export const washerSlotService = {
    create: async (data: Omit<Partial<TWasherSlot>, 'id'>): Promise<TWasherSlot> => {
        const result = await washerSlotRepository.create(data);
        eventBus.emit<TWasherSlotEvents['washer-slot.created']>('washer-slot.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { userId } = await washerSlotRepository.getById(id);
        await washerSlotRepository.deleteById(id);
        eventBus.emit<TWasherSlotEvents['washer-slot.deleted']>('washer-slot.deleted', { id, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TWasherSlotFindQueryDTO
    ): Promise<{ data: TWasherSlot[], total: number }> => {
        return washerSlotRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
        query?: Omit<TWasherSlotFindQueryDTO, 'userId'>
    ): Promise<{ data: TWasherSlot[], total: number }> => {
        return washerSlotRepository.find(limit, page, { userId, ...query });
    },

    getById: async (id: string): Promise<TWasherSlot> => {
        return washerSlotRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TWasherSlot>): Promise<TWasherSlot> => {
        const prev = await washerSlotRepository.getById(id);
        const result = await washerSlotRepository.updateById(id, data);
        eventBus.emit<TWasherSlotEvents['washer-slot.updated']>('washer-slot.updated', { prev, next: result });
        return result;
    },
};
