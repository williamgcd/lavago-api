import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { products } from "../product/product.schema";
import { users } from "../user/user.schema";

export const washerProducts = sqliteTable('washer_products', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),
    productId: text('product_id').references(() => products.id).notNull(),

    isPreferred: integer('is_preferred', { mode: 'boolean' }).notNull().default(false),

    // When the Washer was last used on this product
    lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),

    // Who trained this Washer on this product
    trainedBy: text('trained_by').references(() => users.id),
    trainedAt: integer('trained_at', { mode: 'timestamp' }),

    // Who trained this Washer on this product
    licensedBy: text('licensed_by').references(() => users.id),
    licensedAt: integer('licensed_at', { mode: 'timestamp' }),

    // Some extra information about the Washer/Product
    avgDuration: integer('avg_duration').notNull().default(0),
    avgRating: real('avg_rating').notNull().default(0),

    // Experience level of the Washer on this product
    experienceLevel: integer('experience_level').notNull().default(0),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TWasherProduct = typeof washerProducts.$inferSelect;