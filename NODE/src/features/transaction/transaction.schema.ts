import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const TRANSACTION_STATUS = [ 'CANCELLED', 'COMPLETED', 'FAILED', 'PENDING'  ] as const;
export const TRANSACTION_TYPES = [ 'CREDIT', 'DEBIT' ] as const;
    
export const transactions = sqliteTable('transactions', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),

    type: text('type', { enum: TRANSACTION_TYPES }).notNull(),
    value: integer('value').notNull(),
    description: text('description', { length: 255 }),
    
    object: text('object', { length: 255 }),
    objectId: text('object_id'),
    objectReference: text('object_reference', { length: 255 }),

    status: text('status', { enum: TRANSACTION_STATUS }).notNull().default('PENDING'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type TTransactionStatus = (typeof TRANSACTION_STATUS)[number];
export type TTransactionType = (typeof TRANSACTION_TYPES)[number];
export type TTransaction = typeof transactions.$inferSelect;