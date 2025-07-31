import { z } from 'zod';
import { paymentDTO } from './payment.dto';

export const paymentCreateDTO = paymentDTO.pick({
    userId: true,
    paymentProvider: true,
    paymentProviderId: true,
    paymentMethod: true,
    amount: true,
    currency: true,
    isPreAuthorization: true,
    preAuthorizationId: true,
    preAuthorizationExpiresAt: true,
    description: true,
    metadata: true,
}).required();
export type TPaymentCreateDTO = z.infer<typeof paymentCreateDTO>;

export const paymentFindQueryDTO = paymentDTO.pick({
    userId: true,
    status: true,
    paymentProvider: true,
    paymentMethod: true,
    currency: true,
    isPreAuthorization: true,
}).partial();
export type TPaymentFindQueryDTO = z.infer<typeof paymentFindQueryDTO>;

export const paymentUpdateDTO = paymentDTO.pick({
    status: true,
    paymentProviderId: true,
    retryCount: true,
    retryAttemptAt: true,
    retryExpiresAt: true,
    description: true,
    metadata: true,
}).partial();
export type TPaymentUpdateDTO = z.infer<typeof paymentUpdateDTO>;

export const paymentGetByUserIdDTO = paymentDTO.pick({ userId: true }).required();
export type TPaymentGetByUserIdDTO = z.infer<typeof paymentGetByUserIdDTO>;

export const paymentGetByProviderIdDTO = paymentDTO.pick({ paymentProviderId: true }).required();
export type TPaymentGetByProviderIdDTO = z.infer<typeof paymentGetByProviderIdDTO>;
