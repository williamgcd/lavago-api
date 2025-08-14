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
import { date } from '@/shared/utils/date';

const db = createDbClient('cache');

const repo = {
    parse: async (data: Partial<t.TCacheDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('cache.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new cache record
     * @params values - the cache values to create
     * @returns the created cache record
     */
    create: async (values: Partial<t.TCacheDto>): Promise<t.TCacheDto> => {
        const data = { ...values } as Partial<t.TCacheDto>;
        await repo.parse(data, d.CacheDtoCreate);

        // Check if there is an existing record with the same entity and entity_key
        const exists = await repo.getExisting(data.entity, data.entity_key);
        if (exists && exists.id) {
            throwRecordExists('Cache');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.CacheDto.parse(created);
        } catch (err) {
            console.error('cache.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a cache record
     * @param id - The id of the cache record to delete
     * @param existing - The existing cache record
     * @returns void
     */
    delete: async (
        id: t.TCacheDto['id'],
        existing?: t.TCacheDto,
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
            console.error('cache.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a cache record by id
     * @param id - The id of the cache record to get
     * @returns The cache record
     */
    getById: async (value: t.TCacheDto['id']): Promise<t.TCacheDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Cache');
            }
            return d.CacheDto.parse(data);
        } catch (err) {
            console.error('cache.repo.getById', err);
            throw err;
        }
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
    ): Promise<t.TCacheDto | null> => {
        try {
            const data = await db.single({
                entity: { op: 'eq', value: entity },
                entity_key: { op: 'eq', value: entity_key },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                return null;
            }
            return d.CacheDto.parse(data);
        } catch (err) {
            console.error('cache.repo.getByEntityKey', err);
            throw err;
        }
    },

    /**
     * Get an existing cache record by entity and entity_key
     * @param entity - The entity type
     * @param entity_key - The entity key
     * @returns The existing cache record or undefined
     */
    getExisting: async (
        entity: t.TCacheDto['entity'],
        entity_key: t.TCacheDto['entity_key']
    ): Promise<t.TCacheDto | undefined> => {
        try {
            const data = await db.single({
                entity: { op: 'eq', value: entity },
                entity_key: { op: 'eq', value: entity_key },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Cache');
            }
            if (data && data.expires_at && date.hasExpired(data.expires_at)) {
                await repo.delete(data.id, data, true);
                return undefined;
            }
            return d.CacheDto.parse(data);
        } catch (err) {
            console.error('cache.repo.getExisting', err);
            throw err;
        }
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
        const where: any = {};

        if (filters.entity) {
            const value = filters.entity;
            where.entity = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.CacheDto.parse(r)) };
        } catch (err) {
            console.error('cache.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a cache record
     * @param id - The id of the cache record to update
     * @param values - The cache values to update
     * @param existing - The existing cache record
     * @returns The updated cache record
     */
    update: async (
        id: t.TCacheDto['id'],
        values: Partial<t.TCacheDto>,
        existing?: t.TCacheDto
    ): Promise<t.TCacheDto> => {
        const data = { ...values } as Partial<t.TCacheDto>;
        await repo.parse(values, d.CacheDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.entity;
        delete data.entity_key;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.CacheDto.parse(updated);
        } catch (err) {
            console.error('cache.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as cacheRepository };
export default repo;
