import { eventBus } from "@/libs/event-bus-client";

import { TChatMessageFindQueryDTO } from "./chat-message.controller.dto";
import { TChatMessageEvents } from "./chat-message.events";
import { chatMessageRepository } from "./chat-message.repository";
import { type TChatMessage } from "./chat-message.schema";

export const chatMessageService = {
    create: async (data: Omit<Partial<TChatMessage>, 'id'>): Promise<TChatMessage> => {
        const result = await chatMessageRepository.create(data);
        eventBus.emit<TChatMessageEvents['chat-message.created']>('chat-message.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { chatId, type, actor } = await chatMessageRepository.getById(id);
        await chatMessageRepository.deleteById(id);
        eventBus.emit<TChatMessageEvents['chat-message.deleted']>('chat-message.deleted', { id, chatId, type, actor });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TChatMessageFindQueryDTO
    ): Promise<{ data: TChatMessage[], total: number }> => {
        return chatMessageRepository.find(limit, page, query);
    },

    findByChatId: async (
        chatId: string,
        limit?: number,
        page?: number,
        query?: Omit<TChatMessageFindQueryDTO, 'chatId'>
    ): Promise<{ data: TChatMessage[], total: number }> => {
        return chatMessageRepository.find(limit, page, { chatId, ...query });
    },

    getById: async (id: string): Promise<TChatMessage> => {
        return chatMessageRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TChatMessage>): Promise<TChatMessage> => {
        const prev = await chatMessageRepository.getById(id);
        const result = await chatMessageRepository.updateById(id, data);
        eventBus.emit<TChatMessageEvents['chat-message.updated']>('chat-message.updated', { prev, next: result });
        return result;
    }
};
