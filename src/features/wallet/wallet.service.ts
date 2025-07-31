import { eventBus } from "@/libs/event-bus-client";

import { TWalletFindQueryDTO } from "./wallet.controller.dto";
import { TWalletEvents } from "./wallet.events";
import { walletRepository } from "./wallet.repository";
import { TWallet } from "./wallet.schema";
import { TTransactionType } from "../transaction";

export const walletService = {
    create: async (data: Omit<Partial<TWallet>, 'id'>): Promise<TWallet> => {
        const result = await walletRepository.create(data);
        eventBus.emit<TWalletEvents['wallet.created']>('wallet.created', result);
        return result;
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        const { userId } = await walletRepository.getById(id);
        await walletRepository.deleteById(id, hardDelete);
        eventBus.emit<TWalletEvents['wallet.deleted']>('wallet.deleted', { id, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TWalletFindQueryDTO,
    ): Promise<{ data: TWallet[], total: number }> => {
        return walletRepository.find(limit, page, query);
    },

    getById: async (id: string): Promise<TWallet> => {
        return await walletRepository.getById(id);
    },

    getByUserId: async (userId: string): Promise<TWallet> => {
        return await walletRepository.getByUserId(userId);
    },

    updateBalance: async (userId: string, operation: TTransactionType, amount: number): Promise<void> => {
        const wallet = await walletRepository.getByUserId(userId);
        const balance = operation === 'CREDIT' ? wallet.balance + amount : wallet.balance - amount;
        await walletRepository.updateById(wallet.id, { balance });
    },

    updateById: async (id: string, data: Partial<TWallet>): Promise<TWallet> => {
        const prev = await walletRepository.getById(id);
        const result = await walletRepository.updateById(id, data);
        eventBus.emit<TWalletEvents['wallet.updated']>('wallet.updated', { prev, next: result });
        return result;
    },
};
