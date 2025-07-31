import { eventBus } from "@/libs/event-bus-client";

import { TWasherFindQueryDTO } from "./washer.controller.dto";
import { TWasherEvents } from "./washer.events";
import { washerRepository } from "./washer.repository";
import { type TWasher } from "./washer.schema";

export const washerService = {
    create: async (data: Omit<Partial<TWasher>, 'id'>): Promise<TWasher> => {
        const result = await washerRepository.create(data);
        eventBus.emit<TWasherEvents['washer.created']>('washer.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { userId } = await washerRepository.getById(id);
        await washerRepository.deleteById(id);
        eventBus.emit<TWasherEvents['washer.deleted']>('washer.deleted', { id, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TWasherFindQueryDTO
    ): Promise<{ data: TWasher[], total: number }> => {
        return washerRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
        query?: Omit<TWasherFindQueryDTO, 'userId'>,
    ): Promise<{ data: TWasher[], total: number }> => {
        return washerRepository.find(limit, page, { userId, ...query });
    },

    getById: async (id: string): Promise<TWasher> => {
        return washerRepository.getById(id);
    },

    getByUserId: async (userId: string): Promise<TWasher> => {
        return washerRepository.getByUserId(userId);
    },

    updateById: async (id: string, data: Partial<TWasher>): Promise<TWasher> => {
        const prev = await washerRepository.getById(id);
        const result = await washerRepository.updateById(id, data);
        eventBus.emit<TWasherEvents['washer.updated']>('washer.updated', { prev, next: result });
        return result;
    }
};
