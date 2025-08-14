import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const TransactionDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    created_by: z.string().min(1).max(255).default('system'),

    user_id: z.uuid(),

    status: z.enum(ENUMS.STATUS).default('pending'),

    entity: z.string().min(1).max(255).default('unknown'),
    entity_id: z.uuid(),
    entity_meta: z.record(z.string(), z.any()).default({}),

    operation: z.enum(ENUMS.OPERATION).default('credit'),

    label: z.string().min(1).max(255).default('unknown'),
    value: z.number().min(0).default(0),
    currency: z.string().min(1).max(3).default('BRL'),
});

//* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const TransactionDtoCreate = TransactionDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const TransactionDtoDelete = TransactionDto.pick({
    id: true,
});

export const TransactionDtoFilter = TransactionDto.pick({
    user_id: true,
    entity: true,
    entity_id: true,
    status: true,
    operation: true,
}).partial();

export const TransactionDtoUpdate = TransactionDto.omit({
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

export const TransactionDtoById = z.object({
    transaction_id: TransactionDto.shape.id,
});

export const TransactionDtoByEntity = z.object({
    entity: TransactionDto.shape.entity,
});
export const TransactionDtoByEntityId = z.object({
    entity: TransactionDto.shape.entity,
    entity_id: TransactionDto.shape.entity_id,
});

export const TransactionDtoByUserId = z.object({
    user_id: TransactionDto.shape.user_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const TransactionDtoPublic = TransactionDto;
