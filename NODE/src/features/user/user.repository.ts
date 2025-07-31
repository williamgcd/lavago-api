import { and, count, eq, isNull, like } from "drizzle-orm";

import { PAGINATION } from "@/constants/pagination";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TUser, users } from "./user.schema";

export const userRepository = {
    create: async (data: Omit<Partial<TUser>, 'id'>): Promise<TUser> => {
        const user = {...data } as TUser;

        try {
            if (user.email) {
                await userRepository.getByEmail(user.email);
                throwRecordDuplicated('User already exists with email');
            }
            if (user.phone) {
                const existingUser = await userRepository.getByPhone(user.phone);
                console.log('existingUser', existingUser);
                throwRecordDuplicated('User already exists with phone');
            }
        } catch (err) {
            // Only throw if the error is not a record not found error
            if (!(err instanceof RecordNotFoundError)) {
                console.error('userRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(users).values(user).returning();
            if (result.length === 0) {
                throw new Error('User not created');
            }
            return result[0] as TUser;
        } catch (err) {
            console.error('userRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        try {
            const result = await userRepository.getById(id);
            if (hardDelete) {
                await db.delete(users).where(eq(users.id, result.id));
                return;
            }
            await db.update(users)
                .set({ deletedAt: new Date() })
                .where(eq(users.id, result.id));
        } catch (err) {
            console.error('userRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: Partial<Pick<TUser, 'name' | 'email' | 'phone' | 'document'>>,
    ): Promise<{ data: TUser[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(users.deletedAt)
            ];

            if (query?.name) {
                where.push(like(users.name, `%${query.name}%`));
            }
            if (query?.email) {
                where.push(like(users.email, `%${query.email}%`));
            }
            if (query?.phone) {
                where.push(like(users.phone, `%${query.phone}%`));
            }
            if (query?.document) {
                where.push(like(users.document, `%${query.document}%`));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(users)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(users)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TUser[],
                total: Number(total)
            };
        } catch (err) {
            console.error('userRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TUser> => {
        try {
            const result = await db
                .select()
                .from(users)
                .where(and(
                    eq(users.id, id),
                    isNull(users.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('User not found');
            }
            return result[0] as TUser;
        } catch (err) {
            console.error('userRepository.getById', err);
            throw err;
        }
    },

    getByEmail: async (email: string): Promise<TUser> => {
        try {
            const result = await db
                .select()
                .from(users)
                .where(and(
                    eq(users.email, email),
                    isNull(users.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('User not found');
            }
            return result[0] as TUser;
        } catch (err) {
            console.error('userRepository.getByEmail', err);
            throw err;
        }
    },

    getByPhone: async (phone: string): Promise<TUser> => {
        try {
            const result = await db
                .select()
                .from(users)
                .where(and(
                    eq(users.phone, phone),
                    isNull(users.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('User not found');
            }
            console.log('result', result);
            return result[0] as TUser;
        } catch (err) {
            console.error('userRepository.getByPhone', err);
            throw err;
        }
    },

    getByReferralCode: async (referralCode: string): Promise<TUser> => {
        try {
            const result = await db
                .select()
                .from(users)
                .where(and(
                    eq(users.referralCode, referralCode),
                    isNull(users.deletedAt)
                ))
            if (!result.length) {
                throwRecordNotFound('User not found');
            }
            return result[0] as TUser;
        } catch (err) {
            console.error('userRepository.getByReferralCode', err);
            throw err;
        }
    },

    updateById: async (id: string, user: Partial<TUser>): Promise<TUser> => {
        try {
            const current = await userRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TUser> = Object.fromEntries(
                Object.entries(user).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return userRepository.getById(id);
            }

            const result = await db.update(users)
                .set(updateData)
                .where(eq(users.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('User not found');
            }
            return result[0] as TUser;
        } catch (err) {
            console.error('userRepository.updateById', err);
            throw err;
        }
    }
};