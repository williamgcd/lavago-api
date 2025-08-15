import { ZodObject } from 'zod';

import { throwRecordMissing } from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('schedule-slots');

const repo = {
    /**
     * Creates a new schedule-slot record
     * @params values - the schedule-slot values to create
     * @returns the created schedule-slot record
     */
    create: async (
        values: Partial<t.TScheduleExceptionDto>
    ): Promise<t.TScheduleExceptionDto> => {
        const data = { ...values } as Partial<t.TScheduleExceptionDto>;
        await repo.parse(data, d.ScheduleExceptionDtoCreate);

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.ScheduleExceptionDto.parse(created);
        } catch (err) {
            console.error('schedule.exception.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a schedule-slot record
     * @param id - The id of the schedule-slot record to delete
     * @param existing - The existing schedule-slot record
     * @returns void
     */
    delete: async (
        id: t.TScheduleExceptionDto['id'],
        existing?: t.TScheduleExceptionDto,
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
            console.error('schedule.exception.repo.delete', err);
            throw err;
        }
    },

    /**
     * Fetch schedule exceptions
     * @param filters - The filters to apply to the schedule-exception records
     * @returns The schedule-exception records
     */
    fetch: async (
        filters: t.TScheduleExceptionDtoFilter = {}
    ): Promise<t.TScheduleExceptionDto[]> => {
        const where = await repo.filter(filters);
        try {
            const data = await db.selectAll(where);
            return data.map(r => d.ScheduleExceptionDto.parse(r));
        } catch (err) {
            console.error('schedule.exception.repo.fetch', err);
            throw err;
        }
    },

    /**
     * Filter schedule-exception records
     * @param filters - The filters to apply to the schedule-exception records
     * @returns The filtered schedule-exception records
     */
    filter: async (filters: t.TScheduleExceptionDtoFilter) => {
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        if (filters.is_available) {
            const value = filters.is_available;
            where.is_available = { op: 'eq', value };
        }
        if (filters.type) {
            const value = filters.type;
            where.type = { op: 'eq', value };
        }
        if (filters.interval_ini) {
            const value = filters.interval_ini;
            where.interval_ini = { op: 'eq', value };
        }
        if (filters.interval_end) {
            const value = filters.interval_end;
            where.interval_end = { op: 'eq', value };
        }

        if (filters.washer_id) {
            const value = filters.washer_id;
            where.washer_ids = { op: 'in', value };
        }

        if (!filters.interval_ini && !filters.interval_end && filters.date) {
            const ini = new Date(filters.date + 'T00:00:00Z');
            const end = new Date(filters.date + 'T23:59:59Z');
            where.interval_ini = { op: 'gte', value: ini };
            where.interval_end = { op: 'lte', value: end };
        }

        return where;
    },

    /**
     * Get a schedule-slot record by id
     * @param id - The id of the schedule-slot record to get
     * @returns The schedule-slot record
     */
    getById: async (
        value: t.TScheduleExceptionDto['id']
    ): Promise<t.TScheduleExceptionDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Schedule Exception');
            }
            return d.ScheduleExceptionDto.parse(data);
        } catch (err) {
            console.error('schedule.exception.repo.getById', err);
            throw err;
        }
    },

    /**
     * List schedule-slot records
     * @param filters - The filters to apply to the schedule-slot records
     * @param pagination - The pagination to apply to the schedule-slot records
     * @returns The schedule-slot records
     */
    list: async (
        filters: t.TScheduleExceptionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TScheduleExceptionDto[] }> => {
        const where = await repo.filter(filters);

        try {
            const { count, data } = await db.select(where, pagination);
            const mapped = data.map(r => d.ScheduleExceptionDto.parse(r));
            return { count, data: mapped };
        } catch (err) {
            console.error('schedule.exception.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a schedule-exception record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed schedule-exception record
     */
    parse: async (
        data: Partial<t.TScheduleExceptionDto>,
        schema: ZodObject
    ) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('schedule.exception.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a schedule-slot record
     * @param id - The id of the schedule-slot record to update
     * @param values - The schedule-slot values to update
     * @param existing - The existing schedule-slot record
     * @returns The updated schedule-slot record
     */
    update: async (
        id: t.TScheduleExceptionDto['id'],
        values: Partial<t.TScheduleExceptionDto>,
        existing?: t.TScheduleExceptionDto
    ): Promise<t.TScheduleExceptionDto> => {
        const data = { ...values } as Partial<t.TScheduleExceptionDto>;
        await repo.parse(values, d.ScheduleExceptionDtoUpdate);

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
            const updated = await db.update(record.id, data);
            return d.ScheduleExceptionDto.parse(updated);
        } catch (err) {
            console.error('schedule.exception.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as scheduleExceptionRepository };
export default repo;
