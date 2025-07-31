import { TBooking } from "./booking.schema";

export type TBookingEvents = {
    'booking.created': TBooking;
    'booking.updated': { prev: TBooking, next: TBooking };
    'booking.deleted': { id: string };
    'booking.status.changed': { prev: TBooking, next: TBooking, oldStatus: string, newStatus: string };
    'booking.assigned': TBooking;
    'booking.started': TBooking;
    'booking.completed': TBooking;
    'booking.cancelled': TBooking;
    'booking.rescheduled': TBooking;
};
