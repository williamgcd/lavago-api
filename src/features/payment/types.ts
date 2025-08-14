import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TPaymentDto = z.infer<typeof d.PaymentDto>;

// Default CRUD DTOs
export type TPaymentDtoCreate = z.infer<typeof d.PaymentDtoCreate>;
export type TPaymentDtoDelete = z.infer<typeof d.PaymentDtoDelete>;
export type TPaymentDtoFilter = z.infer<typeof d.PaymentDtoFilter>;
export type TPaymentDtoUpdate = z.infer<typeof d.PaymentDtoUpdate>;

// Controller DTOs
export type TPaymentDtoById = z.infer<typeof d.PaymentDtoById>;
export type TPaymentDtoByUserId = z.infer<typeof d.PaymentDtoByUserId>;
export type TPaymentDtoByBookingId = z.infer<typeof d.PaymentDtoByBookingId>;
export type TPaymentDtoBySubscriptionId = z.infer<typeof d.PaymentDtoBySubscriptionId>;

// Business Logic DTOs
export type TPaymentDtoCreateForBooking = z.infer<typeof d.PaymentDtoCreateForBooking>;
export type TPaymentDtoCreateForSubscription = z.infer<typeof d.PaymentDtoCreateForSubscription>;
export type TPaymentDtoCapture = z.infer<typeof d.PaymentDtoCapture>;
export type TPaymentDtoRefund = z.infer<typeof d.PaymentDtoRefund>;

// Public DTOs
export type TPaymentDtoPublic = z.infer<typeof d.PaymentDtoPublic>;
export type TPaymentDtoPublicWithMeta = z.infer<typeof d.PaymentDtoPublicWithMeta>;
