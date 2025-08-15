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

const db = createDbClient('washer_offerings');

const repo = {
    

    /**
     * Creates a new washer offering record
     * @params values - the washer offering values to create
     * @returns the created washer offering record
     */
    create: async (
        values: Partial<t.TWasherOfferingDto>
    ): Promise<t.TWasherOfferingDto> => {
        const data = { ...values } as Partial<t.TWasherOfferingDto>;
        await repo.parse(data, d.WasherOfferingDtoCreate);

        // Check if there is an existing record with the same unique constraints
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('Washer Offering');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.WasherOfferingDto.parse(created);
        } catch (err) {
            console.error('washer-offering.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a washer offering record
     * @param id - The id of the washer offering record to delete
     * @param existing - The existing washer offering record
     * @returns void
     */
    delete: async (
        id: t.TWasherOfferingDto['id'],
        existing?: t.TWasherOfferingDto,
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
            console.error('washer-offering.repo.delete', err);
            throw err;
        }
    },

    /**
     * Filter washer offerings
     * @param filters - The filters to apply to the washer offerings
     * @returns The filtered washer offerings
     */
    filter: async (filters: t.TWasherOfferingDtoFilter) => {
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        if (filters.offering_id) {
            const value = filters.offering_id;
            where.offering_id = { op: 'eq', value };
        }
        if (filters.washer_id) {
            const value = filters.washer_id;
            where.washer_id = { op: 'eq', value };
        }
        if (filters.is_certified !== undefined) {
            const value = filters.is_certified;
            where.is_certified = { op: 'eq', value };
        }
        if (filters.is_preferred !== undefined) {
            const value = filters.is_preferred;
            where.is_preferred = { op: 'eq', value };
        }
        if (filters.certified_by) {
            const value = filters.certified_by;
            where.certified_by = { op: 'eq', value };
        }
        if (filters.trained_by) {
            const value = filters.trained_by;
            where.trained_by = { op: 'eq', value };
        }
        
        return where;
    },

    /**
     * Get a washer offering record by id
     * @param id - The id of the washer offering record to get
     * @returns The washer offering record
     */
    getById: async (
        value: t.TWasherOfferingDto['id']
    ): Promise<t.TWasherOfferingDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Washer Offering');
            }
            return d.WasherOfferingDto.parse(data);
        } catch (err) {
            console.error('washer-offering.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get an existing washer offering record
     * @param values - The values to get the existing washer offering record for
     * @returns The existing washer offering record
     */
    getExisting: async (values: Partial<t.TWasherOfferingDto>) => {
        try {
            const data = await db.single({
                offering_id: { op: 'eq', value: values.offering_id },
                washer_id: { op: 'eq', value: values.washer_id },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Washer Offering');
            }
            return d.WasherOfferingDto.parse(data);
        } catch (err) {
            console.error('washer-offering.repo.getExisting', err);
            throw err;
        }
    },

    /**
     * List washer offering records
     * @param filters - The filters to apply to the washer offering records
     * @param pagination - The pagination to apply to the washer offering records
     * @returns The washer offering records
     */
    list: async (
        filters: t.TWasherOfferingDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TWasherOfferingDto[] }> => {
        const where = await repo.filter(filters);
        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.WasherOfferingDto.parse(r)) };
        } catch (err) {
            console.error('washer-offering.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a washer offering record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed washer offering record
     */
    parse: async (
        data: Partial<t.TWasherOfferingDto>,
        schema: ZodObject<any>
    ) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('washer-offering.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a washer offering record
     * @param id - The id of the washer offering record to update
     * @param values - The washer offering values to update
     * @param existing - The existing washer offering record
     * @returns The updated washer offering record
     */
    update: async (
        id: t.TWasherOfferingDto['id'],
        values: Partial<t.TWasherOfferingDto>,
        existing?: t.TWasherOfferingDto
    ): Promise<t.TWasherOfferingDto> => {
        const data = { ...values } as Partial<t.TWasherOfferingDto>;
        await repo.parse(values, d.WasherOfferingDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.offering_id;
        delete data.washer_id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.WasherOfferingDto.parse(updated);
        } catch (err) {
            console.error('washer-offering.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as washerOfferingRepository };
export default repo;
