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

const db = createDbClient('wallets');

const repo = {
    /**
     * Creates a new wallet record with default balance and currency
     * @param values - The wallet values to create
     * @returns The created wallet record
     * @throws Error if wallet for user already exists
     * @throws Error if validation fails
     */
    create: async (values: Partial<t.TWalletDto>): Promise<t.TWalletDto> => {
        const data = { ...values } as Partial<t.TWalletDto>;
        await repo.parse(data, d.WalletDtoCreate);

        // Check if there is an existing record
        const exists = await repo.getExisting(data);
        if (exists && exists.id) {
            throwRecordExists('Wallet');
        }

        // Set default create fields
        data.id = data.user_id;
        data.balance = data.balance || 0;
        data.currency = data.currency || 'BRL';

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.WalletDto.parse(created);
        } catch (err) {
            console.error('wallet.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a wallet record (soft delete by default)
     * @param id - The ID of the wallet record to delete
     * @param existing - The existing wallet record (optional, will fetch if not provided)
     * @param hard - Whether to perform hard delete (default: false)
     * @returns Promise that resolves to void
     * @throws Error if wallet not found
     */
    delete: async (
        id: t.TWalletDto['id'],
        existing?: t.TWalletDto,
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
            console.error('wallet.repo.delete', err);
            throw err;
        }
    },

    /**
     * Filter wallet records
     * @param filters - The filters to apply to the wallet records
     * @returns The filtered wallet records
     */
    filter: async (filters: t.TWalletDtoFilter) => {
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        if (filters.user_id) {
            const value = filters.user_id;
            where.user_id = { op: 'eq', value };
        }
        if (filters.currency) {
            const value = filters.currency;
            where.currency = { op: 'eq', value };
        }
        if (filters.balance !== undefined) {
            const value = filters.balance;
            where.balance = { op: 'eq', value };
        }

        return where;
    },

    /**
     * Get a wallet record by ID
     * @param value - The ID of the wallet record to get
     * @returns The wallet record
     * @throws Error if wallet not found
     */
    getById: async (value: t.TWalletDto['id']): Promise<t.TWalletDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Wallet');
            }
            return d.WalletDto.parse(data);
        } catch (err) {
            console.error('wallet.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get a wallet record by user id
     * @param value - The user id of the wallet record to get
     * @returns The wallet record
     */
    getByUserId: async (
        value: t.TWalletDto['user_id']
    ): Promise<t.TWalletDto> => {
        try {
            const data = await db.single({
                user_id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Wallet');
            }
            return d.WalletDto.parse(data);
        } catch (err) {
            console.error('wallet.repo.getByUserId', err);
            throw err;
        }
    },

    /**
     * Get an existing wallet record by user id
     * @param values - The user id of the wallet record to get
     * @returns The wallet record
     */
    getExisting: async (values: Partial<t.TWalletDto>) => {
        if (!values.user_id) {
            throw new Error('UserID is required');
        }

        try {
            const data = await db.single({
                user_id: { op: 'eq', value: values.user_id },
            });
            if (!data) {
                return undefined;
            }
            if (data && data.deleted_at !== null) {
                throwRecordDeleted('Wallet');
            }
            return d.WalletDto.parse(data);
        } catch (err) {
            console.error('wallet.repo.getExisting', err);
            throw err;
        }
    },

    /**
     * List wallet records
     * @param filters - The filters to apply to the wallet records
     * @param pagination - The pagination to apply to the wallet records
     * @returns The wallet records
     */
    list: async (
        filters: t.TWalletDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TWalletDto[] }> => {
        const where = await repo.filter(filters);
        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.WalletDto.parse(r)) };
        } catch (err) {
            console.error('wallet.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse and validate data against a Zod schema
     * @param data - The data to validate
     * @param schema - The Zod schema to validate against
     * @returns The parsed and validated data
     * @throws Error if validation fails
     */
    parse: async (data: Partial<t.TWalletDto>, schema: ZodObject) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('wallet.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a wallet record
     * @param id - The id of the wallet record to update
     * @param values - The wallet values to update
     * @param existing - The existing wallet record
     * @returns The updated wallet record
     */
    update: async (
        id: t.TWalletDto['id'],
        values: Partial<t.TWalletDto>,
        existing?: t.TWalletDto
    ): Promise<t.TWalletDto> => {
        const data = { ...values } as Partial<t.TWalletDto>;
        await repo.parse(values, d.WalletDtoUpdate);

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
            return d.WalletDto.parse(updated);
        } catch (err) {
            console.error('wallet.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as walletRepository };
export default repo;
