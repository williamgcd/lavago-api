import z from 'zod';

import { zNull } from '@/shared/utils/zod';

import { ENUMS } from './enums';
import { VEHICLE_ENUMS } from '../vehicle/enums';

export const BookingDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    status: z.enum(ENUMS.STATUS),

    is_same_day: z.boolean().default(false),
    is_one_time: z.boolean().default(false),

    timestamp: z.coerce.date(),
    timestamps: zNull(z.record(z.string(), z.coerce.date())),

    reschedules_id: zNull(z.uuid()),

    user_id: z.uuid(),
    user_name: zNull(z.string().max(255)),
    user_phone: zNull(z.string().max(255)),
    user_email: zNull(z.string().max(255)),
    user_document: zNull(z.string().max(255)),

    washer_id: zNull(z.uuid()),
    washer_name: zNull(z.string().max(255)),
    washer_phone: zNull(z.string().max(255)),
    washer_email: zNull(z.string().max(255)),
    washer_document: zNull(z.string().max(255)),

    address_id: zNull(z.uuid()),
    property_id: zNull(z.uuid()),

    address_line_1: zNull(z.string().max(255)),
    address_line_2: zNull(z.string().max(255)),
    address_lat: zNull(z.number().min(-90).max(90)),
    address_lng: zNull(z.number().min(-180).max(180)),
    address_zip: zNull(z.string().max(255)),
    address_notes: zNull(z.string().max(255)),

    vehicle_id: zNull(z.uuid()),
    vehicle_name: zNull(z.string().max(255)),
    vehicle_size: zNull(z.enum(VEHICLE_ENUMS.SIZE)),
    vehicle_notes: zNull(z.string().max(255)),

    coupon_id: zNull(z.uuid()),
    coupon_code: zNull(z.string().max(255)),
    coupon_discount: zNull(z.number()),

    price: zNull(z.number()),
    price_discount: zNull(z.number()),
    price_final: zNull(z.number()),
    quota_washer: zNull(z.number()),

    notes: zNull(z.string().max(255)),

    // Checklists for washer validation
    checklist_ini: z.record(z.string(), z.any()).default({}),
    checklist_end: z.record(z.string(), z.any()).default({}),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const BookingDtoCreate = BookingDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    timestamp: true,
});

export const BookingDtoDelete = BookingDto.pick({
    id: true,
});

export const BookingDtoFilter = BookingDto.pick({
    status: true,
    is_same_day: true,
    is_one_time: true,
    timestamp: true,
    reschedules_id: true,
    user_id: true,
    washer_id: true,
    coupon_id: true,
}).partial();

export const BookingDtoUpdate = BookingDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    user_id: true,
    timestamp: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const BookingDtoById = z.object({
    booking_id: BookingDto.shape.id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const BookingDtoPublic = BookingDto;
