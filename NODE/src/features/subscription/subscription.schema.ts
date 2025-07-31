import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";
import { products } from "../product/product.schema";
import { vehicles } from "../vehicle/vehicle.schema";

export const SUBSCRIPTION_STATUSES = ['active', 'paused', 'cancelled'] as const;
export const SUBSCRIPTION_RECURRENCES = ['daily', 'weekly', 'biweekly', 'monthly', 'bimonthly'] as const;
export const SUBSCRIPTION_PAYMENT_PROVIDERS = ['mercadopago', 'pagbank', 'stripe'] as const;

export const subscriptions = sqliteTable('subscriptions', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    
    userId: text('user_id').references(() => users.id).notNull(),
    productId: text('product_id').references(() => products.id).notNull(),
    vehicleId: text('vehicle_id').references(() => vehicles.id).notNull(),
    
    status: text('status', { enum: SUBSCRIPTION_STATUSES }).notNull().default('active'),
    recurrence: text('recurrence', { enum: SUBSCRIPTION_RECURRENCES }).notNull(),
    discountPercentage: real('discount_percentage').notNull(),
    
    paymentProvider: text('payment_provider', { enum: SUBSCRIPTION_PAYMENT_PROVIDERS }).notNull(),
    paymentProviderId: text('payment_provider_id').notNull(),
    
    lastBookingDate: integer('last_booking_date', { mode: 'timestamp' }),
    nextBookingDate: integer('next_booking_date', { mode: 'timestamp' }).notNull(),
    
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TSubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
export type TSubscriptionRecurrence = (typeof SUBSCRIPTION_RECURRENCES)[number];
export type TSubscriptionPaymentProvider = (typeof SUBSCRIPTION_PAYMENT_PROVIDERS)[number];
export type TSubscription = typeof subscriptions.$inferSelect;
