import z from 'zod';

import { validator } from '@/shared/utils/validator';

export const GeofenceDto = z.object({
    is_supported: z.boolean().default(false),
    properties: z.array(z.any()).default([]),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

/* ************************** */
/* Controller DTOs
/* ************************** */

export const GeofenceDtoByZipCode = z.object({
    zip_code: z.string().transform(validator.zipCode),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const GeofenceDtoPublic = GeofenceDto;
