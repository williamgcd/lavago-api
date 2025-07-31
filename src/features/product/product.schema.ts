import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";

const PRODUCT_MODE = [ 'REMOTE', 'CARWASH' ] as const;
    
export const products = sqliteTable('products', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),

    // Product information
    mode: text('mode', { enum: PRODUCT_MODE }).notNull(),

    name: text('name', { length: 255 }).notNull(),
    description: text('description', { length: 255 }),

    price: integer('price').notNull(),
    washerQuota: integer('washer_quota').notNull().default(0),
    traineeQuota: integer('trainee_quota').notNull().default(0),

    duration: integer('duration').notNull().default(60),
    durationEstimate: text('duration_estimate').notNull().default('60-90 min'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TProduct = typeof products.$inferSelect;