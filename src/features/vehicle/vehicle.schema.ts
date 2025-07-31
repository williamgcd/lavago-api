import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const VEHICLE_TYPES = [
    'BIKE',
    'HATCH',
    'MOTORHOME',
    'MOTORCYCLE',
    'PICKUP',
    'SEDAN',
    'SUPERDUTY',
    'SUV',
    'TRICYCLE',
    'TRUCK',
    'UTILITARY',
    'VAN',
] as const;
    
export const vehicles = sqliteTable('vehicles', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),

    type: text('type', { enum: VEHICLE_TYPES }).notNull(),

    plate: text('plate', { length: 10 }),
    brand: text('brand', { length: 20 }),
    model: text('model', { length: 20 }),
    color: text('color', { length: 20 }),

    year: integer('year'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TVehicleType = (typeof VEHICLE_TYPES)[number];
export type TVehicle = typeof vehicles.$inferSelect;