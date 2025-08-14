export const ENUMS = {
    OPERATION: ['credit', 'debit'],
    STATUS: ['cancelled', 'completed', 'failed', 'pending'],
} as const;

export { ENUMS as TRANSACTION_ENUMS };
