import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const WASHER_SLOT_TYPE = [
    'custom',
    'default',
    'time_off',
    'unplanned'
] as const;

export const washerSlots = sqliteTable('washer_slots', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),

    isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
    
    intervalStart: integer('interval_start', { mode: 'timestamp' }).notNull(),
    intervalEnd: integer('interval_end', { mode: 'timestamp' }).notNull(),

    type: text('type', { enum: WASHER_SLOT_TYPE }).notNull().default('custom'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TWasherSlotType = (typeof WASHER_SLOT_TYPE)[number];
export type TWasherSlot = typeof washerSlots.$inferSelect;