import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
    
export const CHAT_STATUS = [ 'OPEN', 'CLOSED' ] as const;

export const chats = sqliteTable('chats', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    
    status: text('status', { enum: CHAT_STATUS }).notNull().default('OPEN'),
    
    object: text('object', { length: 255 }).notNull(),
    objectId: text('object_id').notNull(),

    // Chat information
    title: text('title', { length: 255 }).notNull(),
    description: text('description', { length: 255 }).notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TChat = typeof chats.$inferSelect;