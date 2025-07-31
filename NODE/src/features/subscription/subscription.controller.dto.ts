import { z } from 'zod';
import { subscriptionDTO } from './subscription.dto';

export const subscriptionCreateDTO = subscriptionDTO.pick({
    userId: true,
    productId: true,
    vehicleId: true,
    recurrence: true,
    discountPercentage: true,
    paymentProvider: true,
    paymentProviderId: true,
    nextBookingDate: true,
}).required();
export type TSubscriptionCreateDTO = z.infer<typeof subscriptionCreateDTO>;

export const subscriptionFindQueryDTO = subscriptionDTO.pick({
    userId: true,
    productId: true,
    status: true,
    recurrence: true,
    paymentProvider: true,
}).partial();
export type TSubscriptionFindQueryDTO = z.infer<typeof subscriptionFindQueryDTO>;

export const subscriptionUpdateDTO = subscriptionDTO.pick({
    status: true,
    recurrence: true,
    discountPercentage: true,
    paymentProvider: true,
    paymentProviderId: true,
    lastBookingDate: true,
    nextBookingDate: true,
}).partial();
export type TSubscriptionUpdateDTO = z.infer<typeof subscriptionUpdateDTO>;

export const subscriptionGetByUserIdDTO = subscriptionDTO.pick({ userId: true }).required();
export type TSubscriptionGetByUserIdDTO = z.infer<typeof subscriptionGetByUserIdDTO>;
