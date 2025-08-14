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

const db = createDbClient('tickets');

const repo = {
    parse: async (data: Partial<t.TTicketDto>, schema: ZodObject) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('ticket.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new ticket record
     * @params values - the ticket values to create
     * @returns the created ticket record
     */
    create: async (values: Partial<t.TTicketDto>): Promise<t.TTicketDto> => {
        const data = { ...values } as Partial<t.TTicketDto>;
        await repo.parse(data, d.TicketDtoCreate);

        // Check if there is an existing record with the same unique constraints
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('Ticket');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.TicketDto.parse(created);
        } catch (err) {
            console.error('ticket.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a ticket record
     * @param id - The id of the ticket record to delete
     * @param existing - The existing ticket record
     * @returns void
     */
    delete: async (
        id: t.TTicketDto['id'],
        existing?: t.TTicketDto,
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
            console.error('ticket.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a ticket record by id
     * @param id - The id of the ticket record to get
     * @returns The ticket record
     */
    getById: async (value: t.TTicketDto['id']): Promise<t.TTicketDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Ticket');
            }
            return d.TicketDto.parse(data);
        } catch (err) {
            console.error('ticket.repo.getById', err);
            throw err;
        }
    },

    getExisting: async (values: Partial<t.TTicketDto>) => {
        try {
            const data = await db.single({
                user_id: { op: 'eq', value: values.user_id },
                entity: { op: 'eq', value: values.entity },
                entity_id: { op: 'eq', value: values.entity_id },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Ticket');
            }
            return d.TicketDto.parse(data);
        } catch (err) {
            console.error('ticket.repo.getExisting', err);
            throw err;
        }
    },

    /**
     * List ticket records
     * @param filters - The filters to apply to the ticket records
     * @param pagination - The pagination to apply to the ticket records
     * @returns The ticket records
     */
    list: async (
        filters: t.TTicketDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TTicketDto[] }> => {
        const where: any = {};

        if (filters.user_id) {
            const value = filters.user_id;
            where.user_id = { op: 'eq', value };
        }
        if (filters.assigned_to) {
            const value = filters.assigned_to;
            where.assigned_to = { op: 'eq', value };
        }
        if (filters.entity) {
            const value = filters.entity;
            where.entity = { op: 'eq', value };
        }
        if (filters.entity && filters.entity_id) {
            const value = filters.entity_id;
            where.entity_id = { op: 'eq', value };
        }
        if (filters.status) {
            const value = filters.status;
            where.status = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.TicketDto.parse(r)) };
        } catch (err) {
            console.error('ticket.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a ticket record
     * @param id - The id of the ticket record to update
     * @param values - The ticket values to update
     * @param existing - The existing ticket record
     * @returns The updated ticket record
     */
    update: async (
        id: t.TTicketDto['id'],
        values: Partial<t.TTicketDto>,
        existing?: t.TTicketDto
    ): Promise<t.TTicketDto> => {
        const data = { ...values } as Partial<t.TTicketDto>;
        await repo.parse(values, d.TicketDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Check if assignment changes and update assigned_at
        if (data.assigned_to && data.assigned_to !== record.assigned_to) {
            data.assigned_at = new Date();
        }

        // Remove fields that should not be updated
        delete data.id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.TicketDto.parse(updated);
        } catch (err) {
            console.error('ticket.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as ticketRepository };
export default repo;
