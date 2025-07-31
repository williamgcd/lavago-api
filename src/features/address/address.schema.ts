import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { properties } from "../property/property.schema";
import { users } from "../user/user.schema";
    
export const addresses = sqliteTable('addresses', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),
    propertyId: text('property_id').references(() => properties.id),

    // Address information
    label: text('label', { length: 255 }).notNull(),

    // Address information
    street: text('street', { length: 255 }).notNull(),
    number: text('number', { length: 255 }).notNull(),
    complement: text('complement', { length: 255 }),
    neighborhood: text('neighborhood', { length: 255 }).notNull(),
    city: text('city', { length: 255 }).notNull(),
    state: text('state', { length: 255 }).notNull(),
    country: text('country', { length: 255 }).notNull().default('BR'),
    zip: text('zip', { length: 255 }).notNull(),

    notes: text('notes', { length: 255 }),

    // Geocoding references
    lat: real('lat'),
    lng: real('lng'),

    // Informs if this address is the default one
    isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TAddress = typeof addresses.$inferSelect;