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

const db = createDbClient('transactions');

const repo = {
    parse: async (data: Partial<t.TTransactionDto>, schema: ZodObject) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('transaction.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new transaction record
     * @params values - the transaction values to create
     * @returns the created transaction record
     */
    create: async (
        values: Partial<t.TTransactionDto>
    ): Promise<t.TTransactionDto> => {
        const data = { ...values } as Partial<t.TTransactionDto>;
        await repo.parse(data, d.TransactionDtoCreate);

        // Check if there is an existing record
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('User');
        }

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.TransactionDto.parse(created);
        } catch (err) {
            console.error('transaction.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a transaction record
     * @param id - The id of the transaction record to delete
     * @param existing - The existing transaction record
     * @returns void
     */
    delete: async (
        id: t.TTransactionDto['id'],
        existing?: t.TTransactionDto,
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
            console.error('transaction.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a transaction record by id
     * @param value - The id of the transaction record to get
     * @returns The transaction record
     */
    getById: async (
        value: t.TTransactionDto['id']
    ): Promise<t.TTransactionDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Address');
            }
            return d.TransactionDto.parse(data);
        } catch (err) {
            console.error('transaction.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get an existing transaction record
     * @param values - The values of the transaction record to get
     * @returns The transaction record
     */
    getExisting: async (values: Partial<t.TTransactionDto>) => {
        try {
            const data = await db.single({
                user_id: { op: 'eq', value: values.user_id },
                entity: { op: 'eq', value: values.entity },
                entity_id: { op: 'eq', value: values.entity_id },
                operation: { op: 'eq', value: values.operation },
                value: { op: 'eq', value: values.value },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Transaction');
            }
            return d.TransactionDto.parse(data);
        } catch (err) {
            console.error('transaction.repo.getExisting', err);
            throw err;
        }
    },

    /**
     * List transaction records
     * @param filters - The filters to apply to the transaction records
     * @param pagination - The pagination to apply to the transaction records
     * @returns The transaction records
     */
    list: async (
        filters: t.TTransactionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TTransactionDto[] }> => {
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
        if (filters.status) {
            const value = filters.status;
            where.status = { op: 'eq', value };
        }
        if (filters.operation) {
            const value = filters.operation;
            where.operation = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.TransactionDto.parse(r)) };
        } catch (err) {
            console.error('transaction.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a transaction record
     * @param id - The id of the transaction record to update
     * @param values - The transaction values to update
     * @param existing - The existing transaction record
     * @returns The updated transaction record
     */
    update: async (
        id: t.TTransactionDto['id'],
        values: Partial<t.TTransactionDto>,
        existing?: t.TTransactionDto
    ): Promise<t.TTransactionDto> => {
        const data = { ...values } as Partial<t.TTransactionDto>;
        await repo.parse(values, d.TransactionDtoUpdate);

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
            return d.TransactionDto.parse(updated);
        } catch (err) {
            console.error('transaction.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as transactionRepository };
export default repo;
