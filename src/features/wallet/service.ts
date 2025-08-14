import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a wallet record with event emission
     * @param values - The wallet values to create
     * @returns The created wallet record
     * @throws Error if validation fails or wallet for user already exists
     */
    create: async (values: t.TWalletDtoCreate) => {
        const created = await repo.create(values);
        emitter('user.wallet.created', { id: created.id });
        return created;
    },

    /**
     * Delete a wallet record with event emission
     * @param id - The ID of the wallet record to delete
     * @returns Promise that resolves to void
     * @throws Error if wallet not found
     */
    delete: async (id: t.TWalletDto['id']) => {
        const current = await repo.getById(id);
        emitter('user.wallet.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a wallet record by ID
     * @param id - The ID of the wallet record to get
     * @returns The wallet record
     * @throws Error if wallet not found
     */
    getById: async (id: t.TWalletDto['id']) => {
        return repo.getById(id);
    },

    /**
     * Get a wallet record by user ID
     * @param user_id - The user ID of the wallet record to get
     * @returns The wallet record
     * @throws Error if wallet not found
     */
    getByUserId: async (user_id: t.TWalletDto['user_id']) => {
        return repo.getByUserId(user_id);
    },

    /**
     * List wallet records with filtering and pagination
     * @param filters - The filters to apply to the wallet records
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of wallet records
     * @throws Error if database query fails
     */
    list: async (
        filters: t.TWalletDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TWalletDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * Update a wallet record with event emission
     * @param id - The ID of the wallet record to update
     * @param values - The wallet values to update
     * @returns The updated wallet record
     * @throws Error if wallet not found or validation fails
     */
    update: async (id: t.TWalletDto['id'], values: t.TWalletDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('user.wallet.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as walletService };
export default serv;
