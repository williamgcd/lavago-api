import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const OfferingDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    // Status
    is_active: z.boolean().default(true),

    // Basic Offering identification info
    num: z.string().min(1).max(50),
    sku: z.string().min(1).max(50),

    // Classification options
    mode: z.enum(ENUMS.MODE).default('mobile'),
    type: z.enum(ENUMS.TYPE).default('service'),

    // Name and Description
    label: z.string().min(1).max(255),
    descr: zNull(z.string()),

    // Pricing information
    price: z.number().int().min(0).default(0),
    currency: z.string().length(3).default('BRL'),

    // Washer payment information
    default_washer_quota: z.number().int().min(0).default(0),
    default_washer_share: z.number().int().min(0).default(0),

    duration: z.number().int().min(0).default(60),
    optionals: z.record(z.string(), z.any()).default({}),
    constraints: z.record(z.string(), z.any()).default({}),

    // Vehicle restrictions
    vehicle_sizes: zNull(z.array(z.uuid())),
    vehicle_types: zNull(z.array(z.uuid())),

    // Checklists for washer validation
    checklist_ini: z.record(z.string(), z.any()).default({}),
    checklist_end: z.record(z.string(), z.any()).default({}),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const OfferingDtoCreate = OfferingDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const OfferingDtoDelete = OfferingDto.pick({
    id: true,
});

export const OfferingDtoFilter = OfferingDto.pick({
    is_active: true,
    mode: true,
    type: true,
    currency: true,
}).partial();

export const OfferingDtoUpdate = OfferingDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    num: true,
    sku: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const OfferingDtoById = z.object({
    offering_id: OfferingDto.shape.id,
});

export const OfferingDtoByNum = z.object({
    num: OfferingDto.shape.num,
});

export const OfferingDtoBySku = z.object({
    sku: OfferingDto.shape.sku,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const OfferingDtoPublic = OfferingDto;
