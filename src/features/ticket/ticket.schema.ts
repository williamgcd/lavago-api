import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { users } from "../user/user.schema";

export const TICKET_STATUS = [ 'OPEN', 'CLOSED' ] as const;
    
export const tickets = sqliteTable('tickets', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),

    assignedTo: text('assigned_to').references(() => users.id),
    assignedAt: integer('assigned_at', { mode: 'timestamp' }),

    object: text('object', { length: 255 }),
    objectId: text('object_id'),

    title: text('title', { length: 255 }).notNull(),
    description: text('description').notNull(),

    status: text('status', { enum: TICKET_STATUS }).notNull().default('OPEN'),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TTicketStatus = (typeof TICKET_STATUS)[number];
export type TTicket = typeof tickets.$inferSelect;