import { and, count, eq, isNull } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TChatUser, chatUsers } from "./chat-user.schema";
import { TChatUserFindQueryDTO } from "./chat-user.controller.dto";

export const chatUserRepository = {
    create: async (data: Omit<Partial<TChatUser>, 'id'>): Promise<TChatUser> => {
        const chatUser = {...data } as TChatUser;

        // Check if the chat user is already created with same chatId and userId
        try {
            const { chatId, userId } = chatUser;
            await chatUserRepository.getByChatIdAndUserId(chatId, userId);
            throwRecordDuplicated('Chat user already exists with same chatId and userId');
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('chatUserRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(chatUsers).values(chatUser).returning();
            if (result.length === 0) {
                throw new Error('Chat user not created');
            }
            return result[0] as TChatUser;
        } catch (err) {
            console.error('chatUserRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await chatUserRepository.getById(id);
            await db.update(chatUsers)
                .set({ deletedAt: new Date() })
                .where(eq(chatUsers.id, id));
        } catch (err) {
            console.error('chatUserRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TChatUserFindQueryDTO,
    ): Promise<{ data: TChatUser[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(chatUsers.deletedAt)
            ];

            if (query?.chatId) {
                where.push(eq(chatUsers.chatId, query.chatId));
            }
            if (query?.userId) {
                where.push(eq(chatUsers.userId, query.userId));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(chatUsers)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(chatUsers)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TChatUser[],
                total: Number(total)
            };
        } catch (err) {
            console.error('chatUserRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TChatUser> => {
        try {
            const result = await db
                .select()
                .from(chatUsers)
                .where(and(
                    eq(chatUsers.id, id),
                    isNull(chatUsers.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Chat user not found');
            }
            return result[0] as TChatUser;
        } catch (err) {
            console.error('chatUserRepository.getById', err);
            throw err;
        }
    },

    getByChatIdAndUserId: async (chatId: string, userId: string): Promise<TChatUser> => {
        try {
            const result = await db
                .select()
                .from(chatUsers)
                .where(and(
                    eq(chatUsers.chatId, chatId),
                    eq(chatUsers.userId, userId),
                    isNull(chatUsers.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Chat user not found');
            }
            return result[0] as TChatUser;
        } catch (err) {
            console.error('chatUserRepository.getByChatIdAndUserId', err);
            throw err;
        }
    },

    updateById: async (id: string, chatUser: Partial<TChatUser>): Promise<TChatUser> => {
        try {
            const current = await chatUserRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TChatUser> = Object.fromEntries(
                Object.entries(chatUser).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return chatUserRepository.getById(id);
            }

            // Fields that are not allowed to be updated
            delete updateData.chatId;
            delete updateData.userId;

            const result = await db.update(chatUsers)
                .set(updateData)
                .where(eq(chatUsers.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Chat user not found');
            }
            return result[0] as TChatUser;
        } catch (err) {
            console.error('chatUserRepository.updateById', err);
            throw err;
        }
    }
};;
