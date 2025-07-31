import { TBookingAction } from "./booking-action.schema";

export type TBookingActionEvents = {
    'booking-action.created': TBookingAction;
    'booking-action.updated': { prev: TBookingAction, next: TBookingAction };
    'booking-action.deleted': { id: string };
};
