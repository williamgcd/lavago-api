export const ENUMS = {
    BOOKING_FREQUENCY: [
        'every_day',
        'every_week',
        'every_2_weeks',
        'every_month',
        'every_2_months',
    ],
    PAYMENT_FREQUENCY: [
        'every_booking',
        'every_day',
        'every_week',
        'every_2_weeks',
        'every_month',
        'every_2_months',
    ],
    STATUS: ['active', 'cancelled', 'expired', 'paused'],
} as const;

export { ENUMS as SUBSCRIPTION_ENUMS };
