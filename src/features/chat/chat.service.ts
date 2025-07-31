import { eventBus } from "@/libs/event-bus-client";

import { TChatFindQueryDTO } from "./chat.controller.dto";
import { TChatEvents } from "./chat.events";
import { chatRepository } from "./chat.repository";
import { type TChat } from "./chat.schema";

export const chatService = {
    create: async (data: Omit<Partial<TChat>, 'id'>): Promise<TChat> => {
        const result = await chatRepository.create(data);
        eventBus.emit<TChatEvents['chat.created']>('chat.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { object, objectId } = await chatRepository.getById(id);
        await chatRepository.deleteById(id);
        eventBus.emit<TChatEvents['chat.deleted']>('chat.deleted', { id, object, objectId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TChatFindQueryDTO
    ): Promise<{ data: TChat[], total: number }> => {
        return chatRepository.find(limit, page, query);
    },

    getById: async (id: string): Promise<TChat> => {
        return chatRepository.getById(id);
    },

    getByObjectAndObjectId: async (object: string, objectId: string): Promise<TChat> => {
        return chatRepository.getByObjectAndObjectId(object, objectId);
    },

    updateById: async (id: string, data: Partial<TChat>): Promise<TChat> => {
        const prev = await chatRepository.getById(id);
        const result = await chatRepository.updateById(id, data);
        eventBus.emit<TChatEvents['chat.updated']>('chat.updated', { prev, next: result });
        return result;
    }
};
