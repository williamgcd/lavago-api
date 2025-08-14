import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TScheduleSlotDto = z.infer<typeof d.ScheduleSlotDto>;

// Default CRUD DTOs
export type TScheduleSlotDtoCreate = z.infer<typeof d.ScheduleSlotDtoCreate>;
export type TScheduleSlotDtoDelete = z.infer<typeof d.ScheduleSlotDtoDelete>;
export type TScheduleSlotDtoFilter = z.infer<typeof d.ScheduleSlotDtoFilter>;
export type TScheduleSlotDtoUpdate = z.infer<typeof d.ScheduleSlotDtoUpdate>;

// Controller DTOs
export type TScheduleSlotDtoById = z.infer<typeof d.ScheduleSlotDtoById>;
export type TScheduleSlotDtoByBookingId = z.infer<
    typeof d.ScheduleSlotDtoByBookingId
>;
export type TScheduleSlotDtoByWasherId = z.infer<
    typeof d.ScheduleSlotDtoByWasherId
>;

// Public DTOs
export type TScheduleSlotDtoPublic = z.infer<typeof d.ScheduleSlotDtoPublic>;
