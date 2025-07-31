import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { generatorUtils } from "@/utils/generators";

import { addresses } from "../address/address.schema";
import { properties } from "../property/property.schema";
import { tickets } from "../ticket/ticket.schema";
import { users } from "../user/user.schema";
import { vehicles } from "../vehicle/vehicle.schema";
import { products } from "../product/product.schema";
import { coupons } from "../coupon/coupon.schema";
import { payments } from "../payment/payment.schema";
import { subscriptions } from "../subscription/subscription.schema";

export const BOOKING_STATUS = [
     // Draft/Setup Flow
     'draft',              // User is building the booking
     'pending',           // Booking created, waiting for payment
     
     // Reservation Flow (for subscriptions)
     'reserved',           // Credit card info captured, waiting for pre-auth
     
     // Lifecycle Flow  
     'scheduled',          // Payment confirmed, washer assigned
     'en_route',           // Washer is traveling to location
     'preparing',          // Washer is setting up/pre-wash checklist
     'washing',            // Active washing process
     'finalizing',         // Post-wash checks and photos
     'completed',          // Wash finished successfully
     
     // Cancellation/Error States
     'cancelled',          // Cancelled by user/washer/system
     'rescheduled',        // Rescheduled to different time
     'failed',             // Something went wrong during execution
     'unassigned'          // No washer available, waiting for manual assignment
] as const;

export const bookings = sqliteTable('bookings', {
    id: text('id').primaryKey().notNull().$defaultFn(() => generatorUtils.generateUuid()),
    
    // Booking information
    status: text('status', { enum: BOOKING_STATUS }).notNull().default('draft'),

    // Flags!
    isSameDayBooking: integer('is_same_day_booking', { mode: 'boolean' }).notNull().default(false),
    isOneTimeBooking: integer('is_one_time_booking', { mode: 'boolean' }).notNull().default(false),

    // Rescheduling information
    rescheduledFromId: text('rescheduled_from_id'),

    // Booking dates
    date: integer('date', { mode: 'timestamp' }),
    dateItStarted: integer('date_it_started', { mode: 'timestamp' }),
    dateItEnded: integer('date_it_ended', { mode: 'timestamp' }),

    // Address information
    addressId: text('address_id').references(() => addresses.id),
    address: text('address', { length: 255 }),
    addressLat: real('address_lat'),
    addressLng: real('address_lng'),
    addressNotes: text('address_notes', { length: 255 }),

    // Vehicle information
    vehicleId: text('vehicle_id').references(() => vehicles.id),
    vehicle: text('vehicle', { length: 255 }),

    // Client information
    clientId: text('client_id').references(() => users.id),
    clientName: text('client_name', { length: 255 }),
    clientPhone: text('client_phone', { length: 255 }),

    // Washer information
    washerId: text('washer_id').references(() => users.id),
    washerName: text('washer_name', { length: 255 }),
    washerPhone: text('washer_phone', { length: 255 }),
    washerRating: integer('washer_rating'),

    // Trainee information
    trainerId: text('trainer_id').references(() => users.id),
    trainerName: text('trainer_name', { length: 255 }),
    trainerPhone: text('trainer_phone', { length: 255 }),
    traineeRating: integer('trainee_rating'),

    // Support Information
    ticketId: text('ticket_id').references(() => tickets.id),

    // Product, Payment & Pricing
    productId: text('product_id').references(() => products.id),
    paymentId: text('payment_id').references(() => payments.id),
    subscriptionId: text('subscription_id').references(() => subscriptions.id),

    price: integer('price').notNull(), // in cents
    priceDiscount: integer('price_discount').notNull(), // in cents
    priceTotal: integer('price_total').notNull(), // in cents

    washerQuota: integer('washer_quota').default(0),
    traineeQuota: integer('trainee_quota').default(0),

    // Notes
    clientNotes: text('client_notes', { length: 255 }),
    washerNotes: text('washer_notes', { length: 255 }),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export type TBooking = typeof bookings.$inferSelect;