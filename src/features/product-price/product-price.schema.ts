import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";

import { VEHICLE_TYPES } from "../vehicle/vehicle.schema";
import { products } from "../product/product.schema";
    
export const productPrices = sqliteTable('product_prices', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    productId: text('product_id').references(() => products.id).notNull(),

    vehicleType: text('vehicle_type', { enum: VEHICLE_TYPES }).notNull(),
    
    price: integer('price').notNull(),
    washerQuota: integer('washer_quota').notNull().default(0),
    traineeQuota: integer('trainee_quota').notNull().default(0),

    duration: integer('duration').notNull().default(60),
    durationEstimate: text('duration_estimate').notNull().default('60-90 min'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TProductPrice = typeof productPrices.$inferSelect;