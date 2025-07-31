import { and, count, eq, isNull, like } from "drizzle-orm";

import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TAddress, addresses } from "./address.schema";

export const addressRepository = {
    create: async (data: Omit<Partial<TAddress>, 'id'>): Promise<TAddress> => {
        const address = {...data } as TAddress;

        try {
            const result = await db.insert(addresses).values(address).returning();
            if (result.length === 0) {
                throw new Error('Address not created');
            }
            return result[0] as TAddress;
        } catch (err) {
            console.error('addressRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        try {
            const result = await addressRepository.getById(id);
            if (hardDelete) {
                await db.delete(addresses).where(eq(addresses.id, result.id));
                return;
            }
            await db.update(addresses)
                .set({ deletedAt: new Date() })
                .where(eq(addresses.id, result.id));
        } catch (err) {
            console.error('addressRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: Partial<Pick<TAddress, 'userId' | 'city' | 'state' | 'zip'>>,
    ): Promise<{ data: TAddress[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(addresses.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(addresses.userId, query.userId));
            }
            if (query?.state) {
                where.push(eq(addresses.state, query.state));
            }
            if (query?.state && query?.city) {
                where.push(like(addresses.city, `${query.city}%`));
            }
            if (query?.zip) {
                where.push(like(addresses.zip, `${query.zip}%`));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(addresses)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(addresses)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TAddress[],
                total: Number(total)
            };
        } catch (err) {
            console.error('addressRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TAddress> => {
        try {
            const result = await db
                .select()
                .from(addresses)
                .where(and(
                    eq(addresses.id, id),
                    isNull(addresses.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Address not found');
            }
            return result[0] as TAddress;
        } catch (err) {
            console.error('addressRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, address: Partial<TAddress>): Promise<TAddress> => {
        try {
            const updateData: Partial<TAddress> = Object.fromEntries(
                Object.entries(address).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return addressRepository.getById(id);
            }

            const result = await db.update(addresses)
                .set(updateData)
                .where(eq(addresses.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Address not found');
            }
            return result[0] as TAddress;
        } catch (err) {
            console.error('addressRepository.updateById', err);
            throw err;
        }
    }
}; 