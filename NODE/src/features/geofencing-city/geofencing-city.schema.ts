import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";

export const geofencingCities = sqliteTable('geofencing_cities', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    
    // City identifier (e.g., "Jundiai/SP/BR")
    identifier: text('identifier', { length: 255 }).notNull().unique(),

    // Informs if this city is supported for bookings
	// null means we dont know, false means not supported, true means supported
    isSupported: integer('is_supported', { mode: 'boolean' }),

    // Zip code range
    zipRangeStart: text('zip_range_start', { length: 255 }).notNull(),
    zipRangeEnd: text('zip_range_end', { length: 255 }).notNull(),

    // City information
    country: text('country', { length: 255 }).notNull().default('BR'),
    state: text('state', { length: 255 }).notNull(),
    city: text('city', { length: 255 }).notNull(),

    // Geocoding references
    lat: real('lat'),
    lng: real('lng'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TGeofencingCity = typeof geofencingCities.$inferSelect;