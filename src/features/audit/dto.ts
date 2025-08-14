import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const AuditDto = z.object({
    id: z.uuid(),

    timestamp: z.coerce.date().default(new Date()),

    creator_user: z.string().default('system'),
    creator_role: z.enum(ENUMS.ROLE).default('system'),

    entity: z.string().max(40),
    entity_id: z.string(),
    entity_meta: zNull(z.record(z.string(), z.any())),

    action: z.string(),
    message: z.string(),

    request_id: zNull(z.uuid()),
    request_ip: zNull(z.string()),
    request_ua: zNull(z.string()),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const AuditDtoCreate = AuditDto.omit({
    id: true,
    timestamp: true,
    creator_user: true,
    creator_role: true,
});

export const AuditDtoDelete = AuditDto.pick({
    id: true,
});

export const AuditDtoFilter = AuditDto.pick({
    creator_user: true,
    creator_role: true,
    entity: true,
    entity_id: true,
    action: true,
    request_id: true,
});

export const AuditDtoUpdate = AuditDto.pick({
    entity_meta: true,
    action: true,
    message: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const AuditDtoById = z.object({
    audit_id: AuditDto.shape.id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const AuditDtoPublic = AuditDto;
