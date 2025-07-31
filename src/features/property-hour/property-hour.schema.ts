import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { properties } from "../property/property.schema";

export const PROPERTY_HOUR_DAY_OF_WEEK = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
] as const;

export const propertyHours = sqliteTable('property_hours', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    propertyId: text('property_id').references(() => properties.id).notNull(),

    dayOfWeek: text('day_of_week', { enum: PROPERTY_HOUR_DAY_OF_WEEK }).notNull(),
    hourStart: integer('hour_start', { mode: 'timestamp' }).notNull(),
    hourEnd: integer('hour_end', { mode: 'timestamp' }).notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TPropertyHourDayOfWeek = (typeof PROPERTY_HOUR_DAY_OF_WEEK)[number];
export type TPropertyHour = typeof propertyHours.$inferSelect;