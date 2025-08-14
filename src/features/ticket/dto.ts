import z from 'zod';

import { zNull } from '@/shared/utils/zod';

import { ENUMS } from './enums';

export const TicketDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    user_id: z.uuid(),

    assigned_at: zNull(z.coerce.date()),
    assigned_to: zNull(z.uuid()),

    entity: z.string().min(1).max(40),
    entity_id: z.uuid(),
    entity_meta: z.record(z.string(), z.any()).default({}),

    status: z.enum(ENUMS.STATUS).default('pending'),

    label: z.string().min(1).max(255),
    descr: zNull(z.string()),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const TicketDtoCreate = TicketDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    status: true,
});

export const TicketDtoDelete = TicketDto.pick({
    id: true,
});

export const TicketDtoFilter = TicketDto.pick({
    user_id: true,
    assigned_to: true,
    entity: true,
    entity_id: true,
    status: true,
}).partial();

export const TicketDtoUpdate = TicketDto.pick({
    assigned_to: true,
    entity_meta: true,
    status: true,
    label: true,
    descr: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const TicketDtoById = z.object({
    ticket_id: TicketDto.shape.id,
});

export const TicketDtoByAssignedTo = z.object({
    assigned_to: TicketDto.shape.assigned_to,
});

export const TicketDtoByEntity = z.object({
    entity: TicketDto.shape.entity,
});

export const TicketDtoByEntityId = z.object({
    entity: TicketDto.shape.entity,
    entity_id: TicketDto.shape.entity_id,
});

export const TicketDtoByUserId = z.object({
    user_id: TicketDto.shape.user_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const TicketDtoPublic = TicketDto.omit({
    entity_meta: true,
});
