import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";

import { bookings } from "../booking/booking.schema";
import { users } from "../user/user.schema";

export const bookingRatings = sqliteTable('booking_ratings', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    userId: text('user_id').references(() => users.id).notNull(),
    bookingId: text('booking_id').references(() => bookings.id).notNull(),

    // TODO: Add rating information

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TBookingRating = typeof bookingRatings.$inferSelect;