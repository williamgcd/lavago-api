import { and, count, eq, isNull } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TChat, chats } from "./chat.schema";
import { TChatFindQueryDTO } from "./chat.controller.dto";

export const chatRepository = {
    create: async (data: Omit<Partial<TChat>, 'id'>): Promise<TChat> => {
        const chat = {...data } as TChat;

        // Check if the chat is already created with same object and objectId
        try {
            const { object, objectId } = chat;
            await chatRepository.getByObjectAndObjectId(object, objectId);
            throwRecordDuplicated('Chat already exists with same object and objectId');
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('chatRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(chats).values(chat).returning();
            if (result.length === 0) {
                throw new Error('Chat not created');
            }
            return result[0] as TChat;
        } catch (err) {
            console.error('chatRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await chatRepository.getById(id);
            await db.update(chats)
                .set({ deletedAt: new Date() })
                .where(eq(chats.id, id));
        } catch (err) {
            console.error('chatRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TChatFindQueryDTO,
    ): Promise<{ data: TChat[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(chats.deletedAt)
            ];

            if (query?.status) {
                where.push(eq(chats.status, query.status));
            }
            if (query?.object) {
                where.push(eq(chats.object, query.object));
            }
            if (query?.object && query?.objectId) {
                where.push(eq(chats.objectId, query.objectId));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(chats)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(chats)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TChat[],
                total: Number(total)
            };
        } catch (err) {
            console.error('chatRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TChat> => {
        try {
            const result = await db
                .select()
                .from(chats)
                .where(and(
                    eq(chats.id, id),
                    isNull(chats.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Chat not found');
            }
            return result[0] as TChat;
        } catch (err) {
            console.error('chatRepository.getById', err);
            throw err;
        }
    },

    getByObjectAndObjectId: async (object: string, objectId: string): Promise<TChat> => {
        try {
            const result = await db
                .select()
                .from(chats)
                .where(and(
                    eq(chats.object, object),
                    eq(chats.objectId, objectId),
                    isNull(chats.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Chat not found');
            }
            return result[0] as TChat;
        } catch (err) {
            console.error('chatRepository.getByObjectAndObjectId', err);
            throw err;
        }
    },

    updateById: async (id: string, chat: Partial<TChat>): Promise<TChat> => {
        try {
            const current = await chatRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TChat> = Object.fromEntries(
                Object.entries(chat).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return chatRepository.getById(id);
            }

            // Fields that are not allowed to be updated
            delete updateData.object;
            delete updateData.objectId;

            const result = await db.update(chats)
                .set(updateData)
                .where(eq(chats.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Chat not found');
            }
            return result[0] as TChat;
        } catch (err) {
            console.error('chatRepository.updateById', err);
            throw err;
        }
    }
};;
