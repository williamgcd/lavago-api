import { ZodObject } from 'zod';

import {
    throwRecordDeleted,
    throwRecordExists,
    throwRecordInactive,
    throwRecordMissing,
} from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('offerings');

const repo = {
    /**
     * Creates a new offering record
     * @params values - the offering values to create
     * @returns the created offering record
     */
    create: async (
        values: Partial<t.TOfferingDto>
    ): Promise<t.TOfferingDto> => {
        const data = { ...values } as Partial<t.TOfferingDto>;
        await repo.parse(data, d.OfferingDtoCreate);

        // Check if there is an existing record with the same SKU
        const exists = await repo.getExisting(data.sku);
        if (exists && exists.id) {
            throwRecordExists('Offering');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.OfferingDto.parse(created);
        } catch (err) {
            console.error('offering.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a offering record
     * @param id - The id of the offering record to delete
     * @param existing - The existing offering record
     * @returns void
     */
    delete: async (
        id: t.TOfferingDto['id'],
        existing?: t.TOfferingDto,
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
            console.error('offering.repo.delete', err);
            throw err;
        }
    },

    /**
     * Filter offering records
     * @param filters - The filters to apply to the offering records
     * @returns The filtered offering records
     */
    filter: async (filters: t.TOfferingDtoFilter) => {
        const where: any = {
            deleted_at: { op: 'is', value: null },
            is_active: { op: 'eq', value: true },
        };

        if (filters.is_active !== undefined) {
            const value = filters.is_active;
            where.is_active = { op: 'eq', value };
        }
        if (filters.mode) {
            const value = filters.mode;
            where.mode = { op: 'eq', value };
        }
        if (filters.type) {
            const value = filters.type;
            where.type = { op: 'eq', value };
        }
        if (filters.currency) {
            const value = filters.currency;
            where.currency = { op: 'eq', value };
        }

        return where;
    },

    /**
     * Get a offering record by id
     * @param id - The id of the offering record to get
     * @returns The offering record
     */
    getById: async (value: t.TOfferingDto['id']): Promise<t.TOfferingDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                is_active: { op: 'eq', value: true },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Offering');
            }
            return d.OfferingDto.parse(data);
        } catch (err) {
            console.error('offering.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get a offering record by num
     * @param num - The num of the offering record to get
     * @returns The offering record
     */
    getByNum: async (value: t.TOfferingDto['num']): Promise<t.TOfferingDto> => {
        try {
            const data = await db.single({
                num: { op: 'eq', value },
                is_active: { op: 'eq', value: true },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Offering');
            }
            return d.OfferingDto.parse(data);
        } catch (err) {
            console.error('offering.repo.getByNum', err);
            throw err;
        }
    },

    /**
     * Get a offering record by sku
     * @param sku - The sku of the offering record to get
     * @returns The offering record
     */
    getBySku: async (value: t.TOfferingDto['sku']): Promise<t.TOfferingDto> => {
        try {
            const data = await db.single({
                sku: { op: 'eq', value },
                is_active: { op: 'eq', value: true },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Offering');
            }
            return d.OfferingDto.parse(data);
        } catch (err) {
            console.error('offering.repo.getBySku', err);
            throw err;
        }
    },

    /**
     * Get an existing offering record by SKU
     * @param sku - The SKU to check
     * @returns The existing offering record or undefined
     */
    getExisting: async (
        sku: t.TOfferingDto['sku']
    ): Promise<t.TOfferingDto | undefined> => {
        if (!sku) {
            return undefined;
        }

        try {
            const data = await db.single({
                sku: { op: 'eq', value: sku },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.is_active !== null) {
                throwRecordInactive('Offering');
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Offering');
            }
            return d.OfferingDto.parse(data);
        } catch (err) {
            console.error('offering.repo.getExisting', err);
            throw err;
        }
    },

    /**
     * List offering records
     * @param filters - The filters to apply to the offering records
     * @param pagination - The pagination to apply to the offering records
     * @returns The offering records
     */
    list: async (
        filters: t.TOfferingDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TOfferingDto[] }> => {
        const where = await repo.filter(filters);
        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.OfferingDto.parse(r)) };
        } catch (err) {
            console.error('offering.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a offering record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed offering record
     */
    parse: async (data: Partial<t.TOfferingDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('offering.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a offering record
     * @param id - The id of the offering record to update
     * @param values - The offering values to update
     * @param existing - The existing offering record
     * @returns The updated offering record
     */
    update: async (
        id: t.TOfferingDto['id'],
        values: Partial<t.TOfferingDto>,
        existing?: t.TOfferingDto
    ): Promise<t.TOfferingDto> => {
        const data = { ...values } as Partial<t.TOfferingDto>;
        await repo.parse(values, d.OfferingDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.num;
        delete data.sku;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.OfferingDto.parse(updated);
        } catch (err) {
            console.error('offering.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as offeringRepository };
export default repo;
