import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const COUPON_DISCOUNT_TYPE = [ 'PERCENTAGE', 'FIXED' ] as const;

export const coupons = sqliteTable('coupons', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    
    code: text('code', { length: 255 }).notNull().unique().$defaultFn(() =>{
        return generatorUtils.generateReferralCode();
    }),

    // Discount information
    discountType: text('discount_type', { enum: COUPON_DISCOUNT_TYPE }).notNull().default('PERCENTAGE'),
    discountValue: real('discount_value').notNull().default(0),

    // Dating information
    beginsAt: integer('begins_at', { mode: 'timestamp' }),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),

    // Usage information
    usageLimit: integer('usage_limit').notNull().default(0),
    usageCount: integer('usage_count').notNull().default(0),
    usageUserId: text('usage_user_id').references(() => users.id),

    // Can reference userId or 'system'
    createdBy: text('created_by').notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TCoupon = typeof coupons.$inferSelect;