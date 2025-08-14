import { ZodObject } from 'zod';

import { throwRecordMissing } from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('audits');

const repo = {
    parse: async (data: Partial<t.TAuditDto>, schema: ZodObject) => {
        try {
            return await schema.parseAsync(data);
        } catch (err) {
            console.error('audit.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new audit record
     * @params values - the audit values to create
     * @returns the created audit record
     */
    create: async (values: Partial<t.TAuditDto>): Promise<t.TAuditDto> => {
        const data = await repo.parse(values, d.AuditDtoCreate);

        // Check if an ther is an existing record
        // For Audit, there is no way to duplicate a record.

        // Set default create fields

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.AuditDto.parse(created);
        } catch (err) {
            console.error('audit.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete an audit record
     * @param id - The id of the audit record to delete
     * @param values - The audit values to delete
     * @param existing - The existing audit record
     * @returns void
     */
    delete: async (
        id: t.TAuditDto['id'],
        existing?: t.TAuditDto
    ): Promise<void> => {
        try {
            // Delete record from the database;
            await db.deleteHard(id);
        } catch (err) {
            console.error('audit.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get an audit record by id
     * @param id - The id of the audit record to get
     * @returns The audit record
     */
    getById: async (value: t.TAuditDto['id']): Promise<t.TAuditDto> => {
        try {
            const data = await db.single({ id: { op: 'eq', value } });
            if (!data || !data.id) {
                throwRecordMissing('Audit');
            }
            return d.AuditDto.parse(data);
        } catch (err) {
            console.error('audit.repo.getById', err);
            throw err;
        }
    },

    /**
     * List audit records
     * @param filters - The filters to apply to the audit records
     * @param pagination - The pagination to apply to the audit records
     * @returns The audit records
     */
    list: async (
        filters: t.TAuditDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TAuditDto[] }> => {
        const where: any = {};

        if (filters.creator_user) {
            const value = filters.creator_user;
            where.creator_user = { op: 'eq', value };
        }

        if (filters.entity) {
            const value = filters.entity;
            where.entity = { op: 'eq', value };
        }
        if (filters.entity && filters.entity_id) {
            const value = filters.entity_id;
            where.entity_id = { op: 'eq', value };
        }

        if (filters.action) {
            const value = filters.action;
            where.action = { op: 'eq', value };
        }

        if (filters.request_id) {
            const value = filters.request_id;
            where.request_id = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.AuditDto.parse(r)) };
        } catch (err) {
            console.error('audit.repo.list', err);
            throw err;
        }
    },

    /**
     * Update an audit record
     * @param id - The id of the audit record to update
     * @param values - The audit values to update
     * @param existing - The existing audit record
     * @returns The updated audit record
     */
    update: async (
        id: t.TAuditDto['id'],
        values: Partial<t.TAuditDto>,
        existing?: t.TAuditDto
    ): Promise<t.TAuditDto> => {
        const data = repo.parse(values, d.AuditDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        // These are usually the filters checked on getExisting;

        // Set default update fields

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.AuditDto.parse(updated);
        } catch (err) {
            console.error('audit.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as auditRepository };
export default repo;
