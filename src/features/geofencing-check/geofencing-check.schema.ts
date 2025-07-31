import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";

export const geofencingChecks = sqliteTable('geofencing_checks', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    
    // Zip code that was checked
    zip: text('zip', { length: 255 }).notNull().unique(),

    // Informs if this zip is supported for bookings
	// null means we dont know, false means not supported, true means supported
    isSupported: integer('is_supported', { mode: 'boolean' }),
    washerCount: integer('washer_count').notNull().default(0),

    // Geocoding references
    lat: real('lat'),
    lng: real('lng'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TGeofencingCheck = typeof geofencingChecks.$inferSelect;