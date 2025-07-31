import { z } from "zod";
import { PAYMENT_STATUSES, PAYMENT_PROVIDERS, PAYMENT_METHODS, PAYMENT_CURRENCY_CODES } from "./payment.schema";

export const paymentDTO = z.object({
    id: z.string(),
    userId: z.string(),
    
    status: z.enum(PAYMENT_STATUSES),
    
    paymentProvider: z.enum(PAYMENT_PROVIDERS),
    paymentProviderId: z.string(),
    paymentMethod: z.enum(PAYMENT_METHODS),
    
    amount: z.number().positive(),
    currency: z.enum(PAYMENT_CURRENCY_CODES),
    
    isPreAuthorization: z.boolean(),
    preAuthorizationId: z.string().optional(),
    preAuthorizationExpiresAt: z.date().optional(),
    
    retryCount: z.number().min(0),
    retryAttemptAt: z.date().optional(),
    retryExpiresAt: z.date().optional(),
    
    description: z.string().optional(),
    metadata: z.string().optional(),
    
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().optional(),
});

export type TPaymentDTO = z.infer<typeof paymentDTO>;
