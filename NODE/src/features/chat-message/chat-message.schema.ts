import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { chats } from "../chat/chat.schema";
    
export const CHAT_MESSAGE_TYPE = [ 'USER', 'SYSTEM' ] as const;

export const chatMessages = sqliteTable('chat_messages', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    chatId: text('chat_id').references(() => chats.id).notNull(),

    // Message information
    type: text('type', { enum: CHAT_MESSAGE_TYPE }).notNull(),
    actor: text('actor', { length: 255 }).notNull(),
    content: text('content').notNull(),

    // Can reference userId or 'system'
    createdBy: text('created_by').notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TChatMessage = typeof chatMessages.$inferSelect;