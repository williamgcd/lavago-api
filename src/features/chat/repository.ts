import { ZodObject } from 'zod';

import {
    throwRecordDeleted,
    throwRecordExists,
    throwRecordMissing,
} from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('chats');

const repo = {
    parse: async (data: Partial<t.TChatDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('chat.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new chat record
     * @params values - the chat values to create
     * @returns the created chat record
     */
    create: async (values: Partial<t.TChatDto>): Promise<t.TChatDto> => {
        const data = { ...values } as Partial<t.TChatDto>;
        await repo.parse(data, d.ChatDtoCreate);

        // Check if there is an existing record with the same entity/entity_id
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('Chat');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.ChatDto.parse(created);
        } catch (err) {
            console.error('chat.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a chat record
     * @param id - The id of the chat record to delete
     * @param existing - The existing chat record
     * @returns void
     */
    delete: async (
        id: t.TChatDto['id'],
        existing?: t.TChatDto,
        hard: boolean = false
    ): Promise<void> => {
        try {
            let record = existing;
            if (!existing) {
                record = await repo.getById(id);
            }
            // Delete record from the database;
            if (hard === true) {
                await db.deleteHard(record.id);
                return;
            }
            await db.deleteSoft(record.id);
        } catch (err) {
            console.error('chat.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a chat record by id
     * @param id - The id of the chat record to get
     * @returns The chat record
     */
    getById: async (value: t.TChatDto['id']): Promise<t.TChatDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Chat');
            }
            return d.ChatDto.parse(data);
        } catch (err) {
            console.error('chat.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get a chat record by entity_id
     * @param entity - The entity of the chat record to get
     * @param entity_id - The entity_id of the chat record to get
     * @returns The chat record
     */
    getByEntityId: async (
        entity: t.TChatDto['entity'],
        entity_id: t.TChatDto['entity_id']
    ): Promise<t.TChatDto> => {
        try {
            const data = await db.single({
                entity: { op: 'eq', value: entity },
                entity_id: { op: 'eq', value: entity_id },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Chat');
            }
            return d.ChatDto.parse(data);
        } catch (err) {
            console.error('chat.repo.getByEntityId', err);
            throw err;
        }
    },

    /**
     * Get an existing chat record by entity and entity_id
     * @param values - The values to get the existing chat record by
     * @returns The existing chat record or undefined
     */
    getExisting: async (
        values: Partial<t.TChatDto>
    ): Promise<t.TChatDto | undefined> => {
        if (!values.entity) {
            throw new Error('Entity is required');
        }
        if (!values.entity_id) {
            throw new Error('EntityID is required');
        }

        try {
            const data = await db.single({
                entity: { op: 'eq', value: values.entity },
                entity_id: { op: 'eq', value: values.entity_id },
            });
            if (!data || !data.id) {
                return undefined;
            }
            if (data.deleted_at !== null) {
                throwRecordDeleted('Chat');
            }
            return d.ChatDto.parse(data);
        } catch (err) {
            console.error('chat.repo.getExisting', err);
            return undefined;
        }
    },

    /**
     * List chat records
     * @param filters - The filters to apply to the chat records
     * @param pagination - The pagination to apply to the chat records
     * @returns The chat records
     */
    list: async (
        filters: t.TChatDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TChatDto[] }> => {
        const where: any = {};

        if (filters.status) {
            const value = filters.status;
            where.status = { op: 'eq', value };
        }
        if (filters.entity) {
            const value = filters.entity;
            where.entity = { op: 'eq', value };
        }

        if (filters.user_id) {
            const value = filters.user_id;
            where.user_ids = { op: 'contains', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.ChatDto.parse(r)) };
        } catch (err) {
            console.error('chat.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a chat record
     * @param id - The id of the chat record to update
     * @param values - The chat values to update
     * @param existing - The existing chat record
     * @returns The updated chat record
     */
    update: async (
        id: t.TChatDto['id'],
        values: Partial<t.TChatDto>,
        existing?: t.TChatDto
    ): Promise<t.TChatDto> => {
        const data = { ...values } as Partial<t.TChatDto>;
        await repo.parse(values, d.ChatDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.entity;
        delete data.entity_id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.ChatDto.parse(updated);
        } catch (err) {
            console.error('chat.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as chatRepository };
export default repo;
