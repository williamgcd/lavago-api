import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
    
export const properties = sqliteTable('properties', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),

    // Property information
    name: text('name', { length: 255 }).notNull(),
    description: text('description', { length: 255 }),

    // Address information
    street: text('street', { length: 255 }).notNull(),
    number: text('number', { length: 255 }).notNull(),
    complement: text('complement', { length: 255 }),
    neighborhood: text('neighborhood', { length: 255 }).notNull(),
    city: text('city', { length: 255 }).notNull(),
    state: text('state', { length: 255 }).notNull(),
    country: text('country', { length: 255 }).notNull().default('BR'),
    zip: text('zip', { length: 255 }).notNull(),

    // Geocoding references
    lat: real('lat'),
    lng: real('lng'),

    // Informs if this property is supported for bookings
	// null means we dont know, false means not supported, true means supported
    isSupported: integer('is_supported', { mode: 'boolean' }),

    // We can agree special deals with the property
    // Discount is a percentage, cashback is in cents.
	agreedDiscount: integer('agreed_discount').notNull().default(0),
	agreedCashbackPerBooking: integer('agreed_cashback_per_booking').notNull().default(0),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TProperty = typeof properties.$inferSelect;