import { ZodObject } from 'zod';

import { throwRecordMissing } from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('ratings');

const repo = {
    /**
     * Creates a new rating record
     * @params values - the rating values to create
     * @returns the created rating record
     */
    create: async (values: Partial<t.TRatingDto>): Promise<t.TRatingDto> => {
        const data = { ...values } as Partial<t.TRatingDto>;
        await repo.parse(data, d.RatingDtoCreate);

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.RatingDto.parse(created);
        } catch (err) {
            console.error('rating.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a rating record
     * @param id - The id of the rating record to delete
     * @param existing - The existing rating record
     * @returns void
     */
    delete: async (
        id: t.TRatingDto['id'],
        existing?: t.TRatingDto,
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
            console.error('rating.repo.delete', err);
            throw err;
        }
    },

    /**
     * Filter rating records
     * @param filters - The filters to apply to the rating records
     * @returns The filtered rating records
     */
    filter: async (filters: t.TRatingDtoFilter) => {
        const where: any = {};

        if (filters.user_id) {
            const value = filters.user_id;
            where.user_id = { op: 'eq', value };
        }
        if (filters.entity) {
            const value = filters.entity;
            where.entity = { op: 'eq', value };
        }
        if (filters.entity && filters.entity_id) {
            const value = filters.entity_id;
            where.entity_id = { op: 'eq', value };
        }

        if (filters.metric) {
            const value = filters.metric;
            where.metric = { op: 'eq', value };
        }
        if (filters.pattern) {
            const value = filters.pattern;
            where.pattern = { op: 'eq', value };
        }

        return where;
    },

    /**
     * Get a rating record by id
     * @param id - The id of the rating record to get
     * @returns The rating record
     */
    getById: async (value: t.TRatingDto['id']): Promise<t.TRatingDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Rating');
            }
            return d.RatingDto.parse(data);
        } catch (err) {
            console.error('rating.repo.getById', err);
            throw err;
        }
    },

    /**
     * List rating records
     * @param filters - The filters to apply to the rating records
     * @param pagination - The pagination to apply to the rating records
     * @returns The rating records
     */
    list: async (
        filters: t.TRatingDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TRatingDto[] }> => {
        const where = await repo.filter(filters);
        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.RatingDto.parse(r)) };
        } catch (err) {
            console.error('rating.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a rating record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed rating record
     */
    parse: async (data: Partial<t.TRatingDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('rating.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a rating record
     * @param id - The id of the rating record to update
     * @param values - The rating values to update
     * @param existing - The existing rating record
     * @returns The updated rating record
     */
    update: async (
        id: t.TRatingDto['id'],
        values: Partial<t.TRatingDto>,
        existing?: t.TRatingDto
    ): Promise<t.TRatingDto> => {
        const data = { ...values } as Partial<t.TRatingDto>;
        await repo.parse(values, d.RatingDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.user_id;
        delete data.entity;
        delete data.entity_id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.RatingDto.parse(updated);
        } catch (err) {
            console.error('rating.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as ratingRepository };
export default repo;
