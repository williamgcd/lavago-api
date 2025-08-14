import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TReferralDto = z.infer<typeof d.ReferralDto>;

// Default CRUD DTOs
export type TReferralDtoCreate = z.infer<typeof d.ReferralDtoCreate>;
export type TReferralDtoDelete = z.infer<typeof d.ReferralDtoDelete>;
export type TReferralDtoFilter = z.infer<typeof d.ReferralDtoFilter>;
export type TReferralDtoUpdate = z.infer<typeof d.ReferralDtoUpdate>;

// Controller DTOs
export type TReferralDtoById = z.infer<typeof d.ReferralDtoById>;
export type TReferralDtoByReferral = z.infer<typeof d.ReferralDtoByReferral>;
export type TReferralDtoByReferrer = z.infer<typeof d.ReferralDtoByReferrer>;
export type TReferralDtoByReferred = z.infer<typeof d.ReferralDtoByReferred>;

// Public DTOs
export type TReferralDtoPublic = z.infer<typeof d.ReferralDtoPublic>;
