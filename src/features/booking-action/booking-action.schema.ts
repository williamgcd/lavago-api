import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";
import { bookings } from "../booking/booking.schema";

export const bookingActions = sqliteTable('booking_actions', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    bookingId: text('booking_id').references(() => bookings.id).notNull(),

    message: text('message', { length: 255 }).notNull(),
    metadata: text('metadata'),
    
    // Can reference userId or 'system'
    createdBy: text('created_by').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type TBookingAction = typeof bookingActions.$inferSelect;