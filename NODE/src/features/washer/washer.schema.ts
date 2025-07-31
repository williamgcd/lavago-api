import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { CONFIG } from "@/config";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const washers = sqliteTable('washers', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),

    // Washer information
    rating: real('rating').notNull().default(0),

    // Geocoding references
    lastLat: real('last_lat'),
    lastLng: real('last_lng'),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp' }),

    // Geofencing configuration
    baseLat: real('base_lat'),
    baseLng: real('base_lng'),
    baseRadius: real('base_radius').notNull().default(CONFIG.geofence.radius),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TWasher = typeof washers.$inferSelect;