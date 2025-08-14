import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TScheduleExceptionDto = z.infer<typeof d.ScheduleExceptionDto>;

// Default CRUD DTOs
export type TScheduleExceptionDtoCreate = z.infer<
    typeof d.ScheduleExceptionDtoCreate
>;
export type TScheduleExceptionDtoDelete = z.infer<
    typeof d.ScheduleExceptionDtoDelete
>;
export type TScheduleExceptionDtoFilter = z.infer<
    typeof d.ScheduleExceptionDtoFilter
>;
export type TScheduleExceptionDtoUpdate = z.infer<
    typeof d.ScheduleExceptionDtoUpdate
>;

// Controller DTOs
export type TScheduleExceptionDtoById = z.infer<
    typeof d.ScheduleExceptionDtoById
>;
export type TScheduleExceptionDtoByWasherId = z.infer<
    typeof d.ScheduleExceptionDtoByWasherId
>;

// Public DTOs
export type TScheduleExceptionDtoPublic = z.infer<
    typeof d.ScheduleExceptionDtoPublic
>;
