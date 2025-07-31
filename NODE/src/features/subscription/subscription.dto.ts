import { z } from "zod";
import { SUBSCRIPTION_STATUSES, SUBSCRIPTION_RECURRENCES, SUBSCRIPTION_PAYMENT_PROVIDERS } from "./subscription.schema";

export const subscriptionDTO = z.object({
    id: z.string(),
    userId: z.string(),
    productId: z.string(),
    vehicleId: z.string(),
    
    status: z.enum(SUBSCRIPTION_STATUSES),
    recurrence: z.enum(SUBSCRIPTION_RECURRENCES),
    discountPercentage: z.number().min(0).max(100),
    
    paymentProvider: z.enum(SUBSCRIPTION_PAYMENT_PROVIDERS),
    paymentProviderId: z.string(),
    
    lastBookingDate: z.date().optional(),
    nextBookingDate: z.date(),
    
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().optional(),
});

export type TSubscriptionDTO = z.infer<typeof subscriptionDTO>;
