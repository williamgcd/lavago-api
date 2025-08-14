import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { ENUMS } from './enums';
import { SCHEDULE } from '@/shared/constants/common';

export const ScheduleSlotDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    // Either references a user or 'system'
    created_by: z.string().max(255).default('system'),

    // The booking this schedule is associated with
    booking_id: zNull(z.uuid()),
    // The washer this schedule belongs to
    washer_id: zNull(z.uuid()),

    // Whether the exception is to make it available or not
    // It might not be available even if no booking.
    is_available: z.boolean().default(true),

    // What type of slot it is
    type: z.enum(ENUMS.TYPE).default('custom'),

    duration: z.coerce.number().default(SCHEDULE.SLOT_DURATION),
    timestamp: z.coerce.date(),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const ScheduleSlotDtoCreate = ScheduleSlotDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const ScheduleSlotDtoDelete = ScheduleSlotDto.pick({
    id: true,
});

export const ScheduleSlotDtoFilter = ScheduleSlotDto.pick({
    booking_id: true,
    washer_id: true,
    is_available: true,
    type: true,
    timestamp: true,
})
    .extend({
        interval_ini: z.coerce.date(),
        interval_end: z.coerce.date(),
    })
    .partial();

export const ScheduleSlotDtoUpdate = ScheduleSlotDto.pick({
    booking_id: true,
    washer_id: true,
    is_available: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const ScheduleSlotDtoById = z.object({
    schedule_slot_id: ScheduleSlotDto.shape.id,
});

export const ScheduleSlotDtoByBookingId = z.object({
    booking_id: z.uuid(),
});

export const ScheduleSlotDtoByWasherId = z.object({
    washer_id: z.uuid(),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const ScheduleSlotDtoPublic = ScheduleSlotDto;
