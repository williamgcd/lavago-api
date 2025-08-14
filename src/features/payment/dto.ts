import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const PaymentDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    // Entity relationships
    user_id: z.uuid(),
    entity: z.string().max(40),
    entity_id: z.uuid(),
    entity_meta: z.record(z.string(), z.any()).default({}),

    // Payment is created internally then provider
    // Once provider returns with information we update the status
    status: z.enum(ENUMS.STATUS).default('pending'),

    // Value details
    amount: z.coerce.number().min(1), // Amount in cents (100 = R$1.00)
    currency: z.string().min(3).max(3).default('BRL'),

    type: zNull(z.enum(ENUMS.TYPE).default('link')),
    method: zNull(z.enum(ENUMS.METHOD)),

    // Provider integration
    provider: z.string().max(40).default('pagbank'),
    provider_id: zNull(z.string().max(255)),
    provider_link: zNull(z.string().max(255)),
    provider_meta: z.record(z.string(), z.any()).default({}),

    // Payment flow
    expires_at: zNull(z.coerce.date()),
    captured_at: zNull(z.coerce.date()),
    refunded_at: zNull(z.coerce.date()),

    // Metadata
    description: zNull(z.string()),
    reason: zNull(z.string()),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const PaymentDtoCreate = PaymentDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    status: true,
    provider_id: true,
    captured_at: true,
    refunded_at: true,
});

export const PaymentDtoDelete = PaymentDto.pick({
    id: true,
});

export const PaymentDtoFilter = PaymentDto.pick({
    user_id: true,
    entity: true,
    entity_id: true,
    status: true,
    type: true,
    method: true,
    provider: true,
}).partial();

export const PaymentDtoUpdate = PaymentDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    user_id: true,
    entity: true,
    entity_id: true,
}).partial();

/* ************************** */
/* Controller DTOs
/* ************************** */

export const PaymentDtoById = z.object({
    payment_id: PaymentDto.shape.id,
});

export const PaymentDtoByEntity = z.object({
    entity: PaymentDto.shape.entity,
});

export const PaymentDtoByEntityId = z.object({
    entity: PaymentDto.shape.entity,
    entity_id: PaymentDto.shape.entity_id,
});

export const PaymentDtoByUserId = z.object({
    user_id: PaymentDto.shape.user_id,
});

/* ************************** */
/* Business Logic DTOs
/* ************************** */

export const PaymentDtoCreateForEntity = z.object({
    entity: PaymentDto.shape.entity,
    entity_id: PaymentDto.shape.entity_id,
    entity_meta: PaymentDto.shape.entity_meta,
    amount: PaymentDto.shape.amount,
    type: PaymentDto.shape.type,
    method: PaymentDto.shape.method,
    description: PaymentDto.shape.description,
});

export const PaymentDtoCapture = z.object({
    payment_id: PaymentDto.shape.id,
    amount: PaymentDto.shape.amount.optional(),
});

export const PaymentDtoRefund = z.object({
    payment_id: PaymentDto.shape.id,
    amount: PaymentDto.shape.amount.optional(),
    reason: zNull(z.string()),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const PaymentDtoPublic = PaymentDto.omit({
    provider_id: true,
    provider_meta: true,
    reason: true,
});

export const PaymentDtoPublicWithMeta = PaymentDto; // Include all fields for admin use
