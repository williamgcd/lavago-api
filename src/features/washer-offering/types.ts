import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TWasherOfferingDto = z.infer<typeof d.WasherOfferingDto>;

// Default CRUD DTOs
export type TWasherOfferingDtoCreate = z.infer<
    typeof d.WasherOfferingDtoCreate
>;
export type TWasherOfferingDtoDelete = z.infer<
    typeof d.WasherOfferingDtoDelete
>;
export type TWasherOfferingDtoFilter = z.infer<
    typeof d.WasherOfferingDtoFilter
>;
export type TWasherOfferingDtoUpdate = z.infer<
    typeof d.WasherOfferingDtoUpdate
>;

// Controller DTOs
export type TWasherOfferingDtoById = z.infer<typeof d.WasherOfferingDtoById>;
export type TWasherOfferingDtoByOfferingId = z.infer<
    typeof d.WasherOfferingDtoByOfferingId
>;
export type TWasherOfferingDtoByWasherId = z.infer<
    typeof d.WasherOfferingDtoByWasherId
>;

// Public DTOs
export type TWasherOfferingDtoPublic = z.infer<
    typeof d.WasherOfferingDtoPublic
>;
