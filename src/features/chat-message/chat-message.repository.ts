import { and, count, eq, isNull, like } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TChatMessage, chatMessages } from "./chat-message.schema";
import { TChatMessageFindQueryDTO } from "./chat-message.controller.dto";

export const chatMessageRepository = {
    create: async (data: Omit<Partial<TChatMessage>, 'id'>): Promise<TChatMessage> => {
        const chatMessage = {...data } as TChatMessage;

        try {
            const result = await db.insert(chatMessages).values(chatMessage).returning();
            if (result.length === 0) {
                throw new Error('Chat message not created');
            }
            return result[0] as TChatMessage;
        } catch (err) {
            console.error('chatMessageRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await chatMessageRepository.getById(id);
            await db.update(chatMessages)
                .set({ deletedAt: new Date() })
                .where(eq(chatMessages.id, id));
        } catch (err) {
            console.error('chatMessageRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TChatMessageFindQueryDTO,
    ): Promise<{ data: TChatMessage[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(chatMessages.deletedAt)
            ];

            if (query?.chatId) {
                where.push(eq(chatMessages.chatId, query.chatId));
            }
            if (query?.type) {
                where.push(eq(chatMessages.type, query.type));
            }
            if (query?.actor) {
                where.push(like(chatMessages.actor, `%${query.actor}%`));
            }
            if (query?.createdBy) {
                where.push(eq(chatMessages.createdBy, query.createdBy));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(chatMessages)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(chatMessages)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TChatMessage[],
                total: Number(total)
            };
        } catch (err) {
            console.error('chatMessageRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TChatMessage> => {
        try {
            const result = await db
                .select()
                .from(chatMessages)
                .where(and(
                    eq(chatMessages.id, id),
                    isNull(chatMessages.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Chat message not found');
            }
            return result[0] as TChatMessage;
        } catch (err) {
            console.error('chatMessageRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, chatMessage: Partial<TChatMessage>): Promise<TChatMessage> => {
        try {
            const current = await chatMessageRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TChatMessage> = Object.fromEntries(
                Object.entries(chatMessage).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return chatMessageRepository.getById(id);
            }

            // Fields that are not allowed to be updated
            delete updateData.chatId;

            const result = await db.update(chatMessages)
                .set(updateData)
                .where(eq(chatMessages.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Chat message not found');
            }
            return result[0] as TChatMessage;
        } catch (err) {
            console.error('chatMessageRepository.updateById', err);
            throw err;
        }
    }
};;
