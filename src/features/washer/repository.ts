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

const db = createDbClient('user_washers');

const repo = {
    parse: async (data: Partial<t.TWasherDto>, schema: ZodObject) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('washer.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new washer record
     * @params values - the washer values to create
     * @returns the created washer record
     */
    create: async (values: Partial<t.TWasherDto>): Promise<t.TWasherDto> => {
        const data = { ...values } as Partial<t.TWasherDto>;
        await repo.parse(data, d.WasherDtoCreate);

        // Check if there is an existing record with the same unique constraints
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('Washer');
        }

        // Set default create fields
        // Washer shares the same ID as the user_id;
        data.id = data.user_id;

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.WasherDto.parse(created);
        } catch (err) {
            console.error('washer.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a washer record
     * @param id - The id of the washer record to delete
     * @param existing - The existing washer record
     * @returns void
     */
    delete: async (
        id: t.TWasherDto['id'],
        existing?: t.TWasherDto,
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
            console.error('washer.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a washer record by id
     * @param value - The id of the washer record to get
     * @returns The washer record
     */
    getById: async (value: t.TWasherDto['id']): Promise<t.TWasherDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Washer');
            }
            return d.WasherDto.parse(data);
        } catch (err) {
            console.error('washer.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get a washer record by user id
     * @param value - The user id of the washer record to get
     * @returns The washer record
     */
    getByUserId: async (
        value: t.TWasherDto['user_id']
    ): Promise<t.TWasherDto> => {
        try {
            const data = await db.single({
                user_id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Washer');
            }
            return d.WasherDto.parse(data);
        } catch (err) {
            console.error('washer.repo.getByUserId', err);
            throw err;
        }
    },

    getExisting: async (values: Partial<t.TWasherDto>) => {
        try {
            const data = await db.single({
                user_id: { op: 'eq', value: values.user_id },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Washer');
            }
            return d.WasherDto.parse(data);
        } catch (err) {
            console.error('washer.repo.getExisting', err);
            throw err;
        }
    },

    /**
     * List washer records
     * @param filters - The filters to apply to the washer records
     * @param pagination - The pagination to apply to the washer records
     * @returns The washer records
     */
    list: async (
        filters: t.TWasherDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TWasherDto[] }> => {
        const where: any = {};

        if (filters.user_id) {
            const value = filters.user_id;
            where.user_id = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.WasherDto.parse(r)) };
        } catch (err) {
            console.error('washer.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a washer record
     * @param id - The id of the washer record to update
     * @param values - The washer values to update
     * @param existing - The existing washer record
     * @returns The updated washer record
     */
    update: async (
        id: t.TWasherDto['id'],
        values: Partial<t.TWasherDto>,
        existing?: t.TWasherDto
    ): Promise<t.TWasherDto> => {
        const data = { ...values } as Partial<t.TWasherDto>;
        await repo.parse(values, d.WasherDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        // These are usually the filters checked on getExisting;
        delete data.id;
        delete data.user_id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(record.id, data);
            return d.WasherDto.parse(updated);
        } catch (err) {
            console.error('washer.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as washerRepository };
export default repo;
