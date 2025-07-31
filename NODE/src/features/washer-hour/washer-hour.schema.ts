import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const WASHER_HOUR_DAY_OF_WEEK = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
] as const;

export const washerHours = sqliteTable('washer_hours', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),

    dayOfWeek: text('day_of_week', { enum: WASHER_HOUR_DAY_OF_WEEK }).notNull(),
    hourStart: integer('hour_start', { mode: 'timestamp' }).notNull(),
    hourEnd: integer('hour_end', { mode: 'timestamp' }).notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TWasherHourDayOfWeek = (typeof WASHER_HOUR_DAY_OF_WEEK)[number];
export type TWasherHour = typeof washerHours.$inferSelect;