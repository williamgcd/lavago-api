import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const PAYMENT_CURRENCY_CODES = ['BRL'] as const
export const PAYMENT_METHODS = ['credit_card', 'debit_card', 'pix'] as const;
export const PAYMENT_PROVIDERS = ['mercadopago', 'pagbank', 'stripe'] as const;
export const PAYMENT_STATUSES = ['pending', 'authorized', 'confirmed', 'failed', 'expired', 'refunded', 'cancelled'] as const;

export const payments = sqliteTable('payments', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),

    status: text('status', { enum: PAYMENT_STATUSES }).notNull().default('pending'),

    paymentProvider: text('payment_provider', { enum: PAYMENT_PROVIDERS }).notNull(),
    paymentProviderId: text('payment_provider_id').notNull(),
    paymentMethod: text('payment_method', { enum: PAYMENT_METHODS }).notNull(),

    amount: integer('amount').notNull(),
    currency: text('currency', { enum: PAYMENT_CURRENCY_CODES }).notNull().default('BRL'),

    // Pre-Authorization specific fields
    isPreAuthorization: integer('is_pre_authorization', { mode: 'boolean' }).notNull().default(false),
    preAuthorizationId: text('pre_authorization_id'),
    preAuthorizationExpiresAt: integer('pre_authorization_expires_at', { mode: 'timestamp' }),

    // Retry specific fields
    retryCount: integer('retry_count').notNull().default(0),
    retryAttemptAt: integer('retry_attempt_at', { mode: 'timestamp' }),
    retryExpiresAt: integer('retry_expires_at', { mode: 'timestamp' }),

    // Metadata
    description: text('description'),
    metadata: text('metadata'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TPaymentProvider = (typeof PAYMENT_PROVIDERS)[number];
export type TPaymentMethod = (typeof PAYMENT_METHODS)[number];
export type TPaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type TPaymentCurrency = (typeof PAYMENT_CURRENCY_CODES)[number];
export type TPayment = typeof payments.$inferSelect;
