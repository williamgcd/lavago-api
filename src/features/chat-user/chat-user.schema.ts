import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { chats } from "../chat/chat.schema";
import { users } from "../user/user.schema";

export const chatUsers = sqliteTable('chat_users', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    chatId: text('chat_id').references(() => chats.id).notNull(),
    userId: text('user_id').references(() => users.id).notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TChatUser = typeof chatUsers.$inferSelect;