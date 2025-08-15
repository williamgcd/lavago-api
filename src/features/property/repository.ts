import { ZodObject } from 'zod';

import { throwRecordDeleted, throwRecordMissing } from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('properties');

const repo = {
    /**
     * Creates a new property record
     * @params values - the property values to create
     * @returns the created property record
     */
    create: async (
        values: Partial<t.TPropertyDto>
    ): Promise<t.TPropertyDto> => {
        const data = { ...values } as Partial<t.TPropertyDto>;
        await repo.parse(data, d.PropertyDtoCreate);

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.PropertyDto.parse(created);
        } catch (err) {
            console.error('property.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a property record
     * @param id - The id of the property record to delete
     * @param existing - The existing property record
     * @returns void
     */
    delete: async (
        id: t.TPropertyDto['id'],
        existing?: t.TPropertyDto,
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
            console.error('property.repo.delete', err);
            throw err;
        }
    },

    /**
     * Filter property records
     * @param filters - The filters to apply to the property records
     * @returns The filtered property records
     */
    filter: async (filters: t.TPropertyDtoFilter) => {
        const where: any = {};

        if (filters.is_supported !== undefined) {
            const value = filters.is_supported;
            where.is_supported = { op: 'eq', value };
        }
        if (filters.zip_code) {
            const value = filters.zip_code;
            where.zip_code = { op: 'eq', value };
        }

        return where;
    },

    /**
     * Get a property record by id
     * @param id - The id of the property record to get
     * @returns The property record
     */
    getById: async (value: t.TPropertyDto['id']): Promise<t.TPropertyDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Property');
            }
            return d.PropertyDto.parse(data);
        } catch (err) {
            console.error('property.repo.getById', err);
            throw err;
        }
    },

    /**
     * List property records
     * @param filters - The filters to apply to the property records
     * @param pagination - The pagination to apply to the property records
     * @returns The property records
     */
    list: async (
        filters: t.TPropertyDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPropertyDto[] }> => {
        const where = await repo.filter(filters);
        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.PropertyDto.parse(r)) };
        } catch (err) {
            console.error('property.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a property record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed property record
     */
    parse: async (data: Partial<t.TPropertyDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('property.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a property record
     * @param id - The id of the property record to update
     * @param values - The property values to update
     * @param existing - The existing property record
     * @returns The updated property record
     */
    update: async (
        id: t.TPropertyDto['id'],
        values: Partial<t.TPropertyDto>,
        existing?: t.TPropertyDto
    ): Promise<t.TPropertyDto> => {
        const data = { ...values } as Partial<t.TPropertyDto>;
        await repo.parse(values, d.PropertyDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.PropertyDto.parse(updated);
        } catch (err) {
            console.error('property.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as propertyRepository };
export default repo;
