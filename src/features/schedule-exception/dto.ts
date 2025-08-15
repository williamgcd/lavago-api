import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { SCHEDULE_SLOT_ENUMS } from '../schedule-slot/enums';

export const ScheduleExceptionDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    // Either references a user or 'system'
    created_by: z.string().max(255).default('system'),

    // Whether the exception is to make it available or not
    is_available: z.boolean().default(true),

    // If the exception is for washers
    // If no washer is specified, it will affect everyone
    washer_ids: z.array(z.uuid()).default([]),

    // What type of slot it is
    type: z.enum(SCHEDULE_SLOT_ENUMS.TYPE).default('custom'),

    interval_ini: z.coerce.date(),
    interval_end: z.coerce.date(),

    reason: zNull(z.string().max(255)),
    comment: zNull(z.string()),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const ScheduleExceptionDtoCreate = ScheduleExceptionDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const ScheduleExceptionDtoDelete = ScheduleExceptionDto.pick({
    id: true,
});

export const ScheduleExceptionDtoFilter = ScheduleExceptionDto.pick({
    is_available: true,
    washer_ids: true,
    type: true,
    interval_ini: true,
    interval_end: true,
})
    .extend({
        date: z.string(),
        washer_id: z.uuid(),
    })
    .partial();

export const ScheduleExceptionDtoUpdate = ScheduleExceptionDto.pick({});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const ScheduleExceptionDtoById = z.object({
    schedule_exception_id: ScheduleExceptionDto.shape.id,
});

export const ScheduleExceptionDtoByDate = z.object({
    date: z.coerce.date(),
});

export const ScheduleExceptionDtoByWasherId = z.object({
    washer_id: z.uuid(),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const ScheduleExceptionDtoPublic = ScheduleExceptionDto;
