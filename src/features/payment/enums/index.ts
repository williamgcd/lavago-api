export const ENUMS = {
    METHOD: ['credit_card', 'pix'],
    STATUS: [
        'authorized',
        'cancelled',
        'declined',
        'expired',
        'paid',
        'pending',
        'processing',
        'waiting',
    ],
    TYPE: [
        'immediate', // Charge immediately using payment method
        'link', // Returns a link to the user
        'pre_auth', // Pre-authorize funds, capture later
    ],
} as const;

export { ENUMS as PAYMENT_ENUMS };
