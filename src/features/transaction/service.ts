import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a transaction record
     * @param values - The transaction values to create
     * @returns The created transaction record
     */
    create: async (values: t.TTransactionDtoCreate) => {
        const created = await repo.create(values);
        emitter('user.transaction.created', { id: created.id });
        return created;
    },

    /**
     * Delete a transaction record
     * @param id - The id of the transaction record to delete
     * @returns void
     */
    delete: async (id: t.TTransactionDto['id']) => {
        const current = await repo.getById(id);
        emitter('user.transaction.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a transaction record by id
     * @param id - The id of the transaction record to get
     * @returns The transaction record
     */
    getById: async (id: t.TTransactionDto['id']) => {
        return repo.getById(id);
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
        return repo.list(filters, pagination);
    },

    /**
     * List transaction records by property id
     * @param property_id - The property id to filter by
     * @param filters - The filters to apply to the transaction records
     * @param pagination - The pagination to apply to the transaction records
     * @returns The transaction records
     */
    listByEntityId: async (
        entity: t.TTransactionDtoFilter['entity'],
        entity_id: t.TTransactionDtoFilter['entity_id'],
        filters: t.TTransactionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TTransactionDto[] }> => {
        filters.entity = entity;
        filters.entity_id = entity_id;
        return repo.list(filters, pagination);
    },

    /**
     * List transaction records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the transaction records
     * @param pagination - The pagination to apply to the transaction records
     * @returns The transaction records
     */
    listByUserId: async (
        user_id: t.TTransactionDtoFilter['user_id'],
        filters: t.TTransactionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TTransactionDto[] }> => {
        filters.user_id = user_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a transaction record
     * @param id - The id of the transaction record to update
     * @param values - The transaction values to update
     * @returns The updated transaction record
     */
    update: async (
        id: t.TTransactionDto['id'],
        values: t.TTransactionDtoUpdate
    ) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('user.transaction.updated', {
            id: current.id,
            current,
            updated,
        });
        return updated;
    },
};

export { serv, serv as transactionService };
export default serv;
