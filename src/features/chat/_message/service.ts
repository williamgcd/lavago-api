import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a chat message record
     * @param values - The chat message values to create
     * @returns The created chat message record
     */
    create: async (
        chat_id: t.TChatMessageDto['chat_id'],
        values: t.TChatMessageDtoCreate
    ) => {
        const created = await repo.create(chat_id, values);
        emitter('chat-message.created', { chat_id, message_id: created.id });
        return created;
    },

    /**
     * Delete a chat message record
     * @param id - The id of the chat message record to delete
     * @returns void
     */
    delete: async (
        chat_id: t.TChatMessageDto['chat_id'],
        message_id: t.TChatMessageDto['id']
    ) => {
        const current = await repo.getById(chat_id, message_id);
        emitter('chat-message.deleted', { chat_id, message_id });
        return repo.delete(chat_id, message_id, current);
    },

    /**
     * Get a chat message record by id
     * @param id - The id of the chat message record to get
     * @returns The chat message record
     */
    getById: async (
        chat_id: t.TChatMessageDto['chat_id'],
        message_id: t.TChatMessageDto['id']
    ) => {
        return repo.getById(chat_id, message_id);
    },

    /**
     * List chat message records
     * @param filters - The filters to apply to the chat message records
     * @param pagination - The pagination to apply to the chat message records
     * @returns The chat message records
     */
    list: async (
        filters: t.TChatMessageDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TChatMessageDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List chat message records by chat id
     * @param chat_id - The chat id to filter by
     * @param filters - The filters to apply to the chat message records
     * @param pagination - The pagination to apply to the chat message records
     * @returns The chat message records
     */
    listByChatId: async (
        chat_id: t.TChatMessageDtoFilter['chat_id'],
        filters: t.TChatMessageDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TChatMessageDto[] }> => {
        filters.chat_id = chat_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a chat message record
     * @param id - The id of the chat message record to update
     * @param values - The chat message values to update
     * @returns The updated chat message record
     */
    update: async (
        chat_id: t.TChatMessageDto['chat_id'],
        message_id: t.TChatMessageDto['id'],
        values: t.TChatMessageDtoUpdate
    ) => {
        const current = await repo.getById(chat_id, message_id);
        const updated = await repo.update(chat_id, message_id, values, current);

        const emmitData = { chat_id, message_id, current, updated };
        emitter('chat-message.updated', emmitData);
        return updated;
    },
};

export { serv, serv as chatMessageService };
export default serv;
