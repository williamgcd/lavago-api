import { and, count, eq, gte, lte } from "drizzle-orm";

import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TWallet, wallets } from "./wallet.schema";
import { TWalletFindQueryDTO } from "./wallet.controller.dto";

export const walletRepository = {
    create: async (data: Omit<Partial<TWallet>, 'id'>): Promise<TWallet> => {
        const wallet = {...data } as TWallet;

        try {
            if (wallet.userId) {
                await walletRepository.getByUserId(wallet.userId);
                throwRecordDuplicated('Wallet already exists for user');
            }
        } catch (err) {
            // Only throw if the error is not a record not found error
            if (!(err instanceof RecordNotFoundError)) {
                console.error('walletRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(wallets).values(wallet).returning();
            if (result.length === 0) {
                throw new Error('Wallet not created');
            }
            return result[0] as TWallet;
        } catch (err) {
            console.error('walletRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        try {
            const result = await walletRepository.getById(id);
            if (hardDelete) {
                await db.delete(wallets).where(eq(wallets.id, result.id));
                return;
            }
            // Note: Wallet schema doesn't have deletedAt, so we'll do hard delete
            await db.delete(wallets).where(eq(wallets.id, result.id));
        } catch (err) {
            console.error('walletRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TWalletFindQueryDTO,
    ): Promise<{ data: TWallet[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [];
            if (query?.balanceMin) {
                where.push(gte(wallets.balance, query.balanceMin));
            }
            if (query?.balanceMax) {
                where.push(lte(wallets.balance, query.balanceMax));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(wallets)
                .where(where.length > 0 ? and(...where) : undefined);
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(wallets)
                .where(where.length > 0 ? and(...where) : undefined)
                .limit(limit)
                .offset(offset);
            return {
                data: result as TWallet[],
                total: Number(total)
            };
        } catch (err) {
            console.error('walletRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TWallet> => {
        try {
            const result = await db
                .select()
                .from(wallets)
                .where(eq(wallets.id, id))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Wallet not found');
            }
            return result[0] as TWallet;
        } catch (err) {
            console.error('walletRepository.getById', err);
            throw err;
        }
    },

    getByUserId: async (userId: string): Promise<TWallet> => {
        try {
            const result = await db
                .select()
                .from(wallets)
                .where(eq(wallets.userId, userId))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Wallet not found');
            }
            return result[0] as TWallet;
        } catch (err) {
            console.error('walletRepository.getByUserId', err);
            throw err;
        }
    },

    updateById: async (id: string, wallet: Partial<TWallet>): Promise<TWallet> => {
        try {
            const current = await walletRepository.getById(id);

            const updateData: Partial<TWallet> = Object.fromEntries(
                Object.entries(wallet).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return walletRepository.getById(id);
            }

            if (updateData.userId && updateData.userId !== current.userId) {
                throw new Error('Wallet user cannot be updated');
            }

            const result = await db.update(wallets)
                .set(updateData)
                .where(eq(wallets.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Wallet not found');
            }
            return result[0] as TWallet;
        } catch (err) {
            console.error('walletRepository.updateById', err);
            throw err;
        }
    }
};
