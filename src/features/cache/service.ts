import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Cache function - creates or updates cache records
     * @param values - The cache values to upsert
     * @returns The cached record
     */
    cache: async (values: t.TCacheDtoUpsert) => {
        const parsed = d.CacheDtoUpsert.parse(values);
        const exists = await repo.getByEntityKey(
            parsed.entity,
            parsed.entity_key
        );
        if (exists) {
            const cache = await repo.update(exists.id, parsed);
            emitter('cache.updated', { id: cache.id });
            return cache;
        }
        const cache = await repo.create(parsed);
        emitter('cache.created', { id: cache.id });
        return cache;
    },

    /**
     * Check function - retrieves cache records without creating
     * @param values - The cache check values
     * @returns The cache record or null
     */
    check: async (values: t.TCacheDtoCheck) => {
        const parsed = d.CacheDtoCheck.parse(values);
        return await repo.getByEntityKey(parsed.entity, parsed.entity_key);
    },

    /**
     * Create a cache record
     * @param values - The cache values to create
     * @returns The created cache record
     */
    create: async (values: t.TCacheDtoCreate) => {
        const created = await repo.create(values);
        emitter('cache.created', { id: created.id });
        return created;
    },

    /**
     * Delete a cache record
     * @param id - The id of the cache record to delete
     * @returns void
     */
    delete: async (id: t.TCacheDto['id']) => {
        const current = await repo.getById(id);
        emitter('cache.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a cache record by id
     * @param id - The id of the cache record to get
     * @returns The cache record
     */
    getById: async (id: t.TCacheDto['id']) => {
        return repo.getById(id);
    },

    /**
     * Get a cache record by entity and entity_key combination
     * @param entity - The entity type
     * @param entity_key - The entity key
     * @returns The cache record
     */
    getByEntityKey: async (
        entity: t.TCacheDto['entity'],
        entity_key: t.TCacheDto['entity_key']
    ) => {
        return repo.getByEntityKey(entity, entity_key);
    },

    /**
     * List cache records
     * @param filters - The filters to apply to the cache records
     * @param pagination - The pagination to apply to the cache records
     * @returns The cache records
     */
    list: async (
        filters: t.TCacheDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TCacheDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List cache records by entity
     * @param entity - The entity type to filter by
     * @param filters - The filters to apply to the cache records
     * @param pagination - The pagination to apply to the cache records
     * @returns The cache records
     */
    listByEntity: async (
        entity: t.TCacheDtoFilter['entity'],
        filters: t.TCacheDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TCacheDto[] }> => {
        filters.entity = entity;
        return repo.list(filters, pagination);
    },

    /**
     * Update a cache record
     * @param id - The id of the cache record to update
     * @param values - The cache values to update
     * @returns The updated cache record
     */
    update: async (id: t.TCacheDto['id'], values: t.TCacheDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('cache.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as cacheService };
export default serv;
