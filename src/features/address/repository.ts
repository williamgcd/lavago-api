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

const db = createDbClient('addresses');

const repo = {
    /**
     * Creates a new address record
     * @params values - the address values to create
     * @returns the created address record
     */
    create: async (values: Partial<t.TAddressDto>): Promise<t.TAddressDto> => {
        const data = { ...values } as Partial<t.TAddressDto>;
        await repo.parse(data, d.AddressDtoCreate);

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.AddressDto.parse(created);
        } catch (err) {
            console.error('address.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a address record
     * @param id - The id of the address record to delete
     * @param existing - The existing address record
     * @returns void
     */
    delete: async (
        id: t.TAddressDto['id'],
        existing?: t.TAddressDto,
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
            console.error('address.repo.delete', err);
            throw err;
        }
    },

    /**
     * Filter address records
     * @param filters - The filters to apply to the address records
     * @returns The filtered address records
     */
    filter: async (filters: t.TAddressDtoFilter) => {
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        if (filters.property_id) {
            const value = filters.property_id;
            where.property_id = { op: 'eq', value };
        }
        if (filters.user_id) {
            const value = filters.user_id;
            where.user_id = { op: 'eq', value };
        }
        if (filters.is_default) {
            const value = filters.is_default;
            where.is_default = { op: 'eq', value };
        }
        if (filters.zip_code) {
            const value = filters.zip_code;
            where.zip_code = { op: 'eq', value };
        }

        return where;
    },

    /**
     * Get a address record by id
     * @param value - The id of the address record to get
     * @returns The address record
     */
    getById: async (value: t.TAddressDto['id']): Promise<t.TAddressDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Address');
            }
            return d.AddressDto.parse(data);
        } catch (err) {
            console.error('address.repo.getById', err);
            throw err;
        }
    },

    /**
     * List address records
     * @param filters - The filters to apply to the address records
     * @param pagination - The pagination to apply to the address records
     * @returns The address records
     */
    list: async (
        filters: t.TAddressDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TAddressDto[] }> => {
        const where = await repo.filter(filters);
        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.AddressDto.parse(r)) };
        } catch (err) {
            console.error('address.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a address record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed address record
     */
    parse: async (data: Partial<t.TAddressDto>, schema: ZodObject) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('address.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a address record
     * @param id - The id of the address record to update
     * @param values - The address values to update
     * @param existing - The existing address record
     * @returns The updated address record
     */
    update: async (
        id: t.TAddressDto['id'],
        values: Partial<t.TAddressDto>,
        existing?: t.TAddressDto
    ): Promise<t.TAddressDto> => {
        const data = { ...values } as Partial<t.TAddressDto>;
        await repo.parse(values, d.AddressDtoUpdate);

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
            return d.AddressDto.parse(updated);
        } catch (err) {
            console.error('address.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as addressRepository };
export default repo;
