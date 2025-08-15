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

const db = createDbClient('schedule-slots');

const repo = {
    /**
     * Creates a new schedule-slot record
     * @params values - the schedule-slot values to create
     * @returns the created schedule-slot record
     */
    create: async (
        values: Partial<t.TScheduleSlotDto>
    ): Promise<t.TScheduleSlotDto> => {
        const data = { ...values } as Partial<t.TScheduleSlotDto>;
        await repo.parse(data, d.ScheduleSlotDtoCreate);

        // Check if there is an existing record with the same unique constraints
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('ScheduleSlot');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.ScheduleSlotDto.parse(created);
        } catch (err) {
            console.error('schedule.slot.repo.create', err);
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
        id: t.TScheduleSlotDto['id'],
        existing?: t.TScheduleSlotDto,
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
            console.error('schedule.slot.repo.delete', err);
            throw err;
        }
    },

    /**
     * Fetch schedule slots
     * @param filters - The filters to apply to the schedule-slot records
     * @returns The schedule slots
     */
    fetch: async (
        filters: t.TScheduleSlotDtoFilter = {}
    ): Promise<t.TScheduleSlotDto[]> => {
        const where = await repo.filter(filters);
        try {
            const data = await db.selectAll(where);
            return data.map(r => d.ScheduleSlotDto.parse(r));
        } catch (err) {
            console.error('schedule.slot.repo.fetch', err);
            throw err;
        }
    },

    /**
     * Fetch schedule slots by interval
     * @param interval_ini - The initial date of the interval
     * @param interval_end - The end date of the interval
     * @returns The schedule slots
     */
    fetchByInterval: async (
        interval_ini: t.TScheduleSlotDtoFilter['interval_ini'],
        interval_end: t.TScheduleSlotDtoFilter['interval_end']
    ): Promise<t.TScheduleSlotDto[]> => {
        // Interval cannot be bigger than 7 days
        const days = 7 * 24 * 60 * 60 * 1000;
        const diff = interval_end.getTime() - interval_ini.getTime();
        if (diff > days) {
            throw new Error('Interval cannot be bigger than 7 days');
        }
        try {
            const data = await db.selectAll({
                interval_ini: { op: 'gte', value: interval_ini },
                interval_end: { op: 'lte', value: interval_end },
                deleted_at: { op: 'is', value: null },
            });
            return data.map(r => d.ScheduleSlotDto.parse(r));
        } catch (err) {
            console.error('schedule.slot.repo.fetchByInterval', err);
            throw err;
        }
    },

    /**
     * Filter schedule slots
     * @param filters - The filters to apply to the schedule slots
     * @returns The filtered schedule slots
     */
    filter: async (filters: t.TScheduleSlotDtoFilter) => {
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        if (filters.booking_id) {
            const value = filters.booking_id;
            where.booking_id = { op: 'eq', value };
        }
        
        if (filters.booking_id) {
            const value = filters.booking_id;
            where.booking_id = { op: 'eq', value };
        }
        if (filters.washer_id) {
            const value = filters.washer_id;
            where.washer_id = { op: 'eq', value };
        }
        if (filters.is_available) {
            const value = filters.is_available;
            where.is_available = { op: 'eq', value };
        }
        if (filters.timestamp) {
            const value = filters.timestamp;
            where.timestamp.push({ op: 'eq', value });
        }
        if (filters.offering_ids) {
            const value = filters.offering_ids;
            where.offering_ids = { op: 'in', value };
        }
        if (filters.type) {
            const value = filters.type;
            where.type = { op: 'eq', value };
        }

        if (filters.offering_id) {
            const value = filters.offering_id;
            where.offering_ids = { op: 'contains', value };
        }

        if (!filters.timestamp && filters.date) {
            const ini = new Date(filters.date + 'T00:00:00Z');
            const end = new Date(filters.date + 'T23:59:59Z');
            where.timestamp = [
                { op: 'gte', value: ini },
                { op: 'lte', value: end },
            ];
        }

        if (
            !filters.timestamp &&
            (filters.interval_ini || filters.interval_end)
        ) {
            where.timestamp = [];
            if (filters.interval_ini) {
                const value = filters.interval_ini;
                where.timestamp.push({ op: 'gte', value });
            }
            if (filters.interval_end) {
                const value = filters.interval_end;
                where.timestamp.push({ op: 'lte', value });
            }
        }

        return where;
    },

    /**
     * Get a schedule-slot record by id
     * @param id - The id of the schedule-slot record to get
     * @returns The schedule-slot record
     */
    getById: async (
        value: t.TScheduleSlotDto['id']
    ): Promise<t.TScheduleSlotDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Schedule Slot');
            }
            return d.ScheduleSlotDto.parse(data);
        } catch (err) {
            console.error('schedule.slot.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get an existing schedule-slot record
     * @param values - The values to get the existing schedule-slot record for
     * @returns The existing schedule-slot record
     */
    getExisting: async (values: Partial<t.TScheduleSlotDto>) => {
        try {
            const data = await db.single({
                washer_id: { op: 'eq', value: values.washer_id },
                timestamp: { op: 'eq', value: values.timestamp },
            });
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Schedule Slot');
            }
            if (data) {
                return d.ScheduleSlotDto.parse(data);
            }
            const dataBooking = await db.single({
                booking_id: { op: 'eq', value: values.booking_id },
                deleted_at: { op: 'is', value: null },
            });
            if (dataBooking) {
                return d.ScheduleSlotDto.parse(data);
            }
            return undefined;
        } catch (err) {
            console.error('schedule.slot.repo.getExisting', err);
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
        filters: t.TScheduleSlotDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TScheduleSlotDto[] }> => {
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.ScheduleSlotDto.parse(r)) };
        } catch (err) {
            console.error('schedule.slot.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a schedule-slot record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed schedule-slot record
     */
    parse: async (data: Partial<t.TScheduleSlotDto>, schema: ZodObject) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('schedule.slot.repo.parse', err);
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
        id: t.TScheduleSlotDto['id'],
        values: Partial<t.TScheduleSlotDto>,
        existing?: t.TScheduleSlotDto
    ): Promise<t.TScheduleSlotDto> => {
        const data = { ...values } as Partial<t.TScheduleSlotDto>;
        await repo.parse(values, d.ScheduleSlotDtoUpdate);

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
            return d.ScheduleSlotDto.parse(updated);
        } catch (err) {
            console.error('schedule.slot.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as scheduleSlotRepository };
export default repo;
