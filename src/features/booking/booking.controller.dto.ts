import { z } from 'zod';
import { bookingDTO } from './booking.dto';

export const bookingCreateDTO = bookingDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
}).partial().extend({
    clientId: z.string(),
    productId: z.string(),
    price: z.number().positive(),
    priceDiscount: z.number().min(0),
    priceTotal: z.number().positive(),
});
export type TBookingCreateDTO = z.infer<typeof bookingCreateDTO>;

export const bookingFindQueryDTO = bookingDTO.pick({
    status: true,
    isSameDayBooking: true,
    isOneTimeBooking: true,
    clientId: true,
    washerId: true,
    trainerId: true,
    productId: true,
    subscriptionId: true,
    ticketId: true,
    addressId: true,
    vehicleId: true,
}).partial();
export type TBookingFindQueryDTO = z.infer<typeof bookingFindQueryDTO>;

export const bookingUpdateDTO = bookingDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
}).partial();
export type TBookingUpdateDTO = z.infer<typeof bookingUpdateDTO>;

export const bookingGetByClientIdDTO = bookingDTO.pick({ clientId: true }).required();
export type TBookingGetByClientIdDTO = z.infer<typeof bookingGetByClientIdDTO>;

export const bookingGetByWasherIdDTO = bookingDTO.pick({ washerId: true }).required();
export type TBookingGetByWasherIdDTO = z.infer<typeof bookingGetByWasherIdDTO>;

export const bookingGetBySubscriptionIdDTO = bookingDTO.pick({ subscriptionId: true }).required();
export type TBookingGetBySubscriptionIdDTO = z.infer<typeof bookingGetBySubscriptionIdDTO>;
