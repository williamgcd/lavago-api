import { ZodObject } from 'zod';

import { throwRecordDeleted, throwRecordMissing } from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('chat_messsages');

const repo = {
    parse: async (data: Partial<t.TChatMessageDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('chat-message.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new chat message record
     * @params values - the chat message values to create
     * @returns the created chat message record
     */
    create: async (
        chat_id: t.TChatMessageDto['chat_id'],
        values: Partial<t.TChatMessageDto>
    ): Promise<t.TChatMessageDto> => {
        const data = { ...values } as Partial<t.TChatMessageDto>;
        await repo.parse(data, d.ChatMessageDtoCreate);

        // Set default create fields
        data.chat_id = chat_id;

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.ChatMessageDto.parse(created);
        } catch (err) {
            console.error('chat-message.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a chat message record
     * @param id - The id of the chat message record to delete
     * @param existing - The existing chat message record
     * @returns void
     */
    delete: async (
        chat_id: t.TChatMessageDto['chat_id'],
        message_id: t.TChatMessageDto['id'],
        existing?: t.TChatMessageDto,
        hard: boolean = false
    ): Promise<void> => {
        try {
            let record = existing;
            if (!existing) {
                record = await repo.getById(chat_id, message_id);
            }
            // Delete record from the database;
            if (hard === true) {
                await db.deleteHard(record.id);
                return;
            }
            await db.deleteSoft(record.id);
        } catch (err) {
            console.error('chat-message.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a chat message record by id
     * @param id - The id of the chat message record to get
     * @returns The chat message record
     */
    getById: async (
        chat_id: t.TChatMessageDto['chat_id'],
        message_id: t.TChatMessageDto['id']
    ): Promise<t.TChatMessageDto> => {
        try {
            const data = await db.single({
                chat_id: { op: 'eq', value: chat_id },
                id: { op: 'eq', value: message_id },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('ChatMessage');
            }
            return d.ChatMessageDto.parse(data);
        } catch (err) {
            console.error('chat-message.repo.getById', err);
            throw err;
        }
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
        const where: any = {};

        if (!filters.chat_id) {
            throw new Error('Not possible to list messages from all chats');
        }

        if (filters.chat_id) {
            const value = filters.chat_id;
            where.chat_id = { op: 'eq', value };
        }
        if (filters.type) {
            const value = filters.type;
            where.type = { op: 'eq', value };
        }
        if (filters.created_by) {
            const value = filters.created_by;
            where.created_by = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.ChatMessageDto.parse(r)) };
        } catch (err) {
            console.error('chat-message.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a chat message record
     * @param id - The id of the chat message record to update
     * @param values - The chat message values to update
     * @param existing - The existing chat message record
     * @returns The updated chat message record
     */
    update: async (
        chat_id: t.TChatMessageDto['chat_id'],
        message_id: t.TChatMessageDto['id'],
        values: Partial<t.TChatMessageDto>,
        existing?: t.TChatMessageDto
    ): Promise<t.TChatMessageDto> => {
        const data = { ...values } as Partial<t.TChatMessageDto>;
        await repo.parse(values, d.ChatMessageDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(chat_id, message_id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.chat_id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(record.id, data);
            return d.ChatMessageDto.parse(updated);
        } catch (err) {
            console.error('chat-message.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as chatMessageRepository };
export default repo;
