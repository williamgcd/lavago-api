import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TOfferingDto = z.infer<typeof d.OfferingDto>;

// Default CRUD DTOs
export type TOfferingDtoCreate = z.infer<typeof d.OfferingDtoCreate>;
export type TOfferingDtoDelete = z.infer<typeof d.OfferingDtoDelete>;
export type TOfferingDtoFilter = z.infer<typeof d.OfferingDtoFilter>;
export type TOfferingDtoUpdate = z.infer<typeof d.OfferingDtoUpdate>;

// Controller DTOs
export type TOfferingDtoById = z.infer<typeof d.OfferingDtoById>;
export type TOfferingDtoByNum = z.infer<typeof d.OfferingDtoByNum>;
export type TOfferingDtoBySku = z.infer<typeof d.OfferingDtoBySku>;

// Public DTOs
export type TOfferingDtoPublic = z.infer<typeof d.OfferingDtoPublic>; 