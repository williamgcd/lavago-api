import z from 'zod';

import { zKeyInterval, zNull } from '@/shared/utils/zod';
import { ConstraintsDto } from '@/shared/dtos/contraints';
import { PROPERTY } from '@/shared/constants/common';

export const PropertyDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    is_supported: z.boolean().default(false),

    label: z.string().min(1).max(255),
    descr: zNull(z.string()),

    street: z.string().min(1).max(255),
    number: z.string().min(1).max(20),
    complement: zNull(z.string().max(255)),
    neighborhood: z.string().min(1).max(255),
    city: z.string().min(1).max(255),
    state: z.string().min(1).max(255),
    country: z.string().length(2).default('BR'),
    zip_code: z.string().min(1).max(8),

    lat: zNull(z.number().min(-90).max(90)),
    lng: zNull(z.number().min(-180).max(180)),

    default_hours: zKeyInterval.default(PROPERTY.DEFAULT_HOURS),
    default_notes: zNull(z.string().max(255)),

    constraints: ConstraintsDto,

    price_cashback: z.number().min(0).default(0.0),
    price_multiple: z.number().min(0).default(1.0),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const PropertyDtoCreate = PropertyDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const PropertyDtoDelete = PropertyDto.pick({
    id: true,
});

export const PropertyDtoFilter = PropertyDto.pick({
    is_supported: true,
    zip_code: true,
}).partial();

export const PropertyDtoUpdate = PropertyDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const PropertyDtoById = z.object({
    property_id: PropertyDto.shape.id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const PropertyDtoPublic = PropertyDto.omit({
    price_cashback: true,
    price_multiple: true,
}).transform(data => {
    const complement = data.complement ? ` ${data.complement}` : '';
    const address_line_1 = `${data.street}, ${data.number}${complement}, ${data.neighborhood}`;
    const address_line_2 = `${data.zip_code} - ${data.city}, ${data.state} ${data.country}`;
    return { ...data, address_line_1, address_line_2 };
});
