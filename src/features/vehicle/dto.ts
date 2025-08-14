import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';

export const VehicleDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    user_id: z.uuid(),

    size: z.enum(ENUMS.SIZE),
    type: zNull(z.string().min(2).max(40)),

    year: zNull(z.string().optional()),

    brand: zNull(z.string().optional()),
    color: zNull(z.string().optional()),
    model: zNull(z.string().optional()),
    plate: zNull(z.string().min(7).max(8).optional()),

    notes: z.string().optional(),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const VehicleDtoCreate = VehicleDto.pick({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const VehicleDtoDelete = VehicleDto.pick({
    id: true,
});

export const VehicleDtoFilter = VehicleDto.pick({
    user_id: true,
    size: true,
}).partial();

export const VehicleDtoUpdate = VehicleDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    user_id: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const VehicleDtoById = z.object({
    vehicle_id: VehicleDto.shape.id,
});

export const VehicleDtoByUserId = z.object({
    user_id: VehicleDto.shape.user_id,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const VehicleDtoPublic = VehicleDto;
