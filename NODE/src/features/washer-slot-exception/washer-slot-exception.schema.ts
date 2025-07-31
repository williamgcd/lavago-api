import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";

import { users } from "../user/user.schema";
import { WASHER_SLOT_TYPE } from "../washer-slot/washer-slot.schema";

export const washerSlotExceptions = sqliteTable('washer_slot_exceptions', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),

    isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
    
    intervalStart: integer('interval_start', { mode: 'timestamp' }).notNull(),
    intervalEnd: integer('interval_end', { mode: 'timestamp' }).notNull(),

    type: text('type', { enum: WASHER_SLOT_TYPE }).notNull().default('custom'),

    reason: text('reason', { length: 255 }).notNull(),
    justification: text('justification', { length: 255 }).notNull(),

    // Can reference userId or 'system'
    createdBy: text('created_by').notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TWasherSlotException = typeof washerSlotExceptions.$inferSelect;