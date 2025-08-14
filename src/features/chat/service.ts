import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a chat record
     * @param values - The chat values to create
     * @returns The created chat record
     */
    create: async (values: t.TChatDtoCreate) => {
        const created = await repo.create(values);
        emitter('chat.created', { id: created.id });
        return created;
    },

    /**
     * Delete a chat record
     * @param id - The id of the chat record to delete
     * @returns void
     */
    delete: async (id: t.TChatDto['id']) => {
        const current = await repo.getById(id);
        emitter('chat.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a chat record by id
     * @param id - The id of the chat record to get
     * @returns The chat record
     */
    getById: async (id: t.TChatDto['id']) => {
        return repo.getById(id);
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
    ) => {
        return repo.getByEntityId(entity, entity_id);
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
        return repo.list(filters, pagination);
    },

    /**
     * List chat records by entity
     * @param entity - The entity type to filter by
     * @param filters - The filters to apply to the chat records
     * @param pagination - The pagination to apply to the chat records
     * @returns The chat records
     */
    listByEntity: async (
        entity: t.TChatDtoFilter['entity'],
        filters: t.TChatDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TChatDto[] }> => {
        filters.entity = entity;
        return repo.list(filters, pagination);
    },

    /**
     * List chat records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the chat records
     * @param pagination - The pagination to apply to the chat records
     * @returns The chat records
     */
    listByUserId: async (
        user_id: t.TChatDtoFilter['user_id'],
        filters: t.TChatDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TChatDto[] }> => {
        filters.user_id = user_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a chat record
     * @param id - The id of the chat record to update
     * @param values - The chat values to update
     * @returns The updated chat record
     */
    update: async (id: t.TChatDto['id'], values: t.TChatDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('chat.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as chatService };
export default serv;
