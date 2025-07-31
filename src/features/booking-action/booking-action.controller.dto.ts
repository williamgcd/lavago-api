import { z } from 'zod';
import { bookingActionDTO } from './booking-action.dto';

export const bookingActionCreateDTO = bookingActionDTO.pick({
    bookingId: true,
    message: true,
    metadata: true,
    createdBy: true,
}).required();
export type TBookingActionCreateDTO = z.infer<typeof bookingActionCreateDTO>;

export const bookingActionFindQueryDTO = bookingActionDTO.pick({
    bookingId: true,
    createdBy: true,
}).partial();
export type TBookingActionFindQueryDTO = z.infer<typeof bookingActionFindQueryDTO>;

export const bookingActionGetByBookingIdDTO = bookingActionDTO.pick({ bookingId: true }).required();
export type TBookingActionGetByBookingIdDTO = z.infer<typeof bookingActionGetByBookingIdDTO>;

export const bookingActionUpdateDTO = bookingActionDTO.pick({
    message: true,
    metadata: true,
}).partial();
export type TBookingActionUpdateDTO = z.infer<typeof bookingActionUpdateDTO>;
