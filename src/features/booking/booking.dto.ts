import { z } from "zod";
import { BOOKING_STATUS } from "./booking.schema";

export const bookingDTO = z.object({
    id: z.string(),
    
    // Booking information
    status: z.enum(BOOKING_STATUS),
    
    // Flags
    isSameDayBooking: z.boolean(),
    isOneTimeBooking: z.boolean(),
    
    // Rescheduling information
    rescheduledFromId: z.string().optional(),
    
    // Booking dates
    date: z.date().optional(),
    dateItStarted: z.date().optional(),
    dateItEnded: z.date().optional(),
    
    // Address information
    addressId: z.string().optional(),
    address: z.string().max(255).optional(),
    addressLat: z.number().optional(),
    addressLng: z.number().optional(),
    addressNotes: z.string().max(255).optional(),
    
    // Vehicle information
    vehicleId: z.string().optional(),
    vehicle: z.string().max(255).optional(),
    
    // Client information
    clientId: z.string().optional(),
    clientName: z.string().max(255).optional(),
    clientPhone: z.string().max(255).optional(),
    
    // Washer information
    washerId: z.string().optional(),
    washerName: z.string().max(255).optional(),
    washerPhone: z.string().max(255).optional(),
    washerRating: z.number().optional(),
    
    // Trainee information
    trainerId: z.string().optional(),
    trainerName: z.string().max(255).optional(),
    trainerPhone: z.string().max(255).optional(),
    traineeRating: z.number().optional(),
    
    // Support Information
    ticketId: z.string().optional(),
    
    // Product, Payment & Pricing
    productId: z.string().optional(),
    paymentId: z.string().optional(),
    subscriptionId: z.string().optional(),
    
    price: z.number().positive(),
    priceDiscount: z.number().min(0),
    priceTotal: z.number().positive(),
    
    washerQuota: z.number().min(0).optional(),
    traineeQuota: z.number().min(0).optional(),
    
    // Notes
    clientNotes: z.string().max(255).optional(),
    washerNotes: z.string().max(255).optional(),
    
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().optional(),
});

export type TBookingDTO = z.infer<typeof bookingDTO>;
