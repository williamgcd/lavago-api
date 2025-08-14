import z from 'zod';

import { validator } from '@/shared/utils/validator';
import { zNull } from '@/shared/utils/zod';

import { ENUMS } from './enums';
import { ConstraintsDto } from '@/shared/dtos/contraints';

export const AddressDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    property_id: zNull(z.uuid()),
    user_id: z.uuid(),

    is_default: z.boolean().default(false),

    type: z.enum(ENUMS.TYPE).default('unknown'),

    label: zNull(z.string().max(255)),

    street: zNull(z.string().max(255)),
    number: zNull(z.string().max(255)),
    complement: zNull(z.string().max(255)),
    neighborhood: zNull(z.string().max(255)),
    city: zNull(z.string().max(255)),
    state: zNull(z.string().max(255)),
    country: zNull(z.string().max(255)).default('BR'),
    zip_code: zNull(z.coerce.string().transform(validator.zipCode)),

    lat: zNull(z.number().min(-90).max(90)),
    lng: zNull(z.number().min(-180).max(180)),

    notes: zNull(z.string().max(255)),

    constraints: ConstraintsDto,
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const AddressDtoCreate = AddressDto.pick({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const AddressDtoDelete = AddressDto.pick({
    id: true,
});

export const AddressDtoFilter = AddressDto.pick({
    property_id: true,
    user_id: true,
    is_default: true,
    zip_code: true,
}).partial();

export const AddressDtoUpdate = AddressDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    user_id: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const AddressDtoById = z.object({
    address_id: AddressDto.shape.id,
});

export const AddressDtoByPropertyId = z.object({
    property_id: AddressDto.shape.property_id,
});

export const AddressDtoByUserId = z.object({
    user_id: AddressDto.shape.user_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const AddressDtoPublic = AddressDto.omit({
    property_id: true,
}).transform(data => {
    const complement = data.complement ? ` ${data.complement}` : '';
    const address_line_1 = `${data.street}, ${data.number}${complement}, ${data.neighborhood}`;
    const address_line_2 = `${data.zip_code} - ${data.city}, ${data.state} ${data.country}`;
    return { ...data, address_line_1, address_line_2 };
});
