export const ENUMS = {
    STATUS: [
        // Draft/Setup Flow
        'draft', // User is building the booking
        'pending', // Booking created, waiting for payment

        // Reservation Flow (for subscriptions)
        'reserved', // Credit card info captured, waiting for pre-auth
        'scheduled', // Payment confirmed, washer assigned

        // Lifecycle Flow
        'is_traveling', // Washer is traveling to location
        'is_preparing', // Washer is setting up/pre-wash checklist
        'is_executing', // Active washing process
        'is_finishing', // Post-wash checks and photos
        'is_completed', // Wash finished successfully

        // Cancellation or Error States
        'cancelled', // Cancelled by user/washer/system
        'rescheduled', // Rescheduled to different time
        'unassigned', // No washer available, waiting for manual assignment
    ],
} as const;

export { ENUMS as BOOKING_ENUMS };
