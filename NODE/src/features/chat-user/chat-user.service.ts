import { eventBus } from "@/libs/event-bus-client";

import { TChatUserFindQueryDTO } from "./chat-user.controller.dto";
import { TChatUserEvents } from "./chat-user.events";
import { chatUserRepository } from "./chat-user.repository";
import { type TChatUser } from "./chat-user.schema";
import { PAGINATION } from "@/constants";

export const chatUserService = {
    create: async (data: Omit<Partial<TChatUser>, 'id'>): Promise<TChatUser> => {
        const result = await chatUserRepository.create(data);
        eventBus.emit<TChatUserEvents['chat-user.created']>('chat-user.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { chatId, userId } = await chatUserRepository.getById(id);
        await chatUserRepository.deleteById(id);
        eventBus.emit<TChatUserEvents['chat-user.deleted']>('chat-user.deleted', { id, chatId, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TChatUserFindQueryDTO
    ): Promise<{ data: TChatUser[], total: number }> => {
        return chatUserRepository.find(limit, page, query);
    },

    findByChatId: async (chatId: string): Promise<{ data: TChatUser[], total: number }> => {
        return chatUserRepository.find(PAGINATION.DEFAULT_LIMIT_MAX, 1, { chatId });
    },

    findByUserId: async (userId: string): Promise<{ data: TChatUser[], total: number }> => {
        return chatUserRepository.find(PAGINATION.DEFAULT_LIMIT_MAX, 1, { userId });
    },

    getById: async (id: string): Promise<TChatUser> => {
        return chatUserRepository.getById(id);
    },

    getByChatIdAndUserId: async (chatId: string, userId: string): Promise<TChatUser> => {
        return chatUserRepository.getByChatIdAndUserId(chatId, userId);
    },

    updateById: async (id: string, data: Partial<TChatUser>): Promise<TChatUser> => {
        const prev = await chatUserRepository.getById(id);
        const result = await chatUserRepository.updateById(id, data);
        eventBus.emit<TChatUserEvents['chat-user.updated']>('chat-user.updated', { prev, next: result });
        return result;
    }
};
