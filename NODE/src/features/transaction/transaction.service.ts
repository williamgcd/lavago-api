import { PAGINATION } from "@/constants";
import { eventBus } from "@/libs/event-bus-client";
import { TTransactionFindQueryDTO } from "./transaction.controller.dto";
import { transactionRepository } from "./transaction.repository";
import { TTransaction } from "./transaction.schema";
import { TTransactionEvents } from "./transaction.events";

export const transactionService = {
    create: async (data: Omit<Partial<TTransaction>, 'id'>): Promise<TTransaction> => {
        const transaction = await transactionRepository.create(data);
        eventBus.emit<TTransactionEvents['transaction.created']>('transaction.created', transaction);
        return transaction;
    },

    deleteById: async (id: string): Promise<void> => {
        const transaction = await transactionRepository.getById(id);
        await transactionRepository.deleteById(id);
        eventBus.emit<TTransactionEvents['transaction.deleted']>('transaction.deleted', { id, userId: transaction.userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TTransactionFindQueryDTO,
    ): Promise<{ data: TTransaction[], total: number }> => {
        return transactionRepository.find(limit, page, query);
    },

    findByObject: async (
        object: string,
        objectId: string,
    ): Promise<{ data: TTransaction[], total: number }> => {
        const limit = PAGINATION.DEFAULT_LIMIT_MAX;
        return transactionRepository.find(limit, 1, { object, objectId });
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
        query?: TTransactionFindQueryDTO
    ): Promise<{ data: TTransaction[], total: number }> => {
        return transactionRepository.find(limit, page, { userId, ...query });
    },

    getById: async (id: string): Promise<TTransaction> => {
        return transactionRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TTransaction>): Promise<TTransaction> => {
        const prev = await transactionRepository.getById(id);
        const next = await transactionRepository.updateById(id, data);
        eventBus.emit<TTransactionEvents['transaction.updated']>('transaction.updated', { prev, next });


        if (next.status !== prev.status) {
            const event = { id, prevStatus: prev.status, nextStatus: next.status };
            eventBus.emit<TTransactionEvents['transaction.updated.status']>('transaction.updated.status', event);

            if (next.status === 'CANCELLED') {
                eventBus.emit<TTransactionEvents['transaction.updated.status.CANCELLED']>('transaction.updated.status.CANCELLED', next);
            }
            if (next.status === 'COMPLETED') {
                eventBus.emit<TTransactionEvents['transaction.updated.status.COMPLETED']>('transaction.updated.status.COMPLETED', next);
            }
            if (next.status === 'FAILED') {
                eventBus.emit<TTransactionEvents['transaction.updated.status.FAILED']>('transaction.updated.status.FAILED', next);
            }
            if (next.status === 'PENDING') {
                eventBus.emit<TTransactionEvents['transaction.updated.status.PENDING']>('transaction.updated.status.PENDING', next);
            }
        }

        return next;
    },
};
