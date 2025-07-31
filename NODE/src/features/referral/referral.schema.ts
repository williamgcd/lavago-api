import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const REFERRAL_STATUS = [ 'PENDING', 'COMPLETED', 'FAILED', 'CANCELLED' ] as const;
    
export const referrals = sqliteTable('referrals', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    
    referrerUserId: text('referrer_user_id').references(() => users.id).notNull(),
    referredUserId: text('referred_user_id').references(() => users.id).notNull(),

    value: integer('value').notNull(),

    status: text('status', { enum: REFERRAL_STATUS }).notNull().default('PENDING'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TReferralStatus = (typeof REFERRAL_STATUS)[number];
export type TReferral = typeof referrals.$inferSelect;