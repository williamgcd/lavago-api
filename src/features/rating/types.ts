import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TRatingDto = z.infer<typeof d.RatingDto>;

// Default CRUD DTOs
export type TRatingDtoCreate = z.infer<typeof d.RatingDtoCreate>;
export type TRatingDtoDelete = z.infer<typeof d.RatingDtoDelete>;
export type TRatingDtoFilter = z.infer<typeof d.RatingDtoFilter>;
export type TRatingDtoUpdate = z.infer<typeof d.RatingDtoUpdate>;

// Controller DTOs
export type TRatingDtoById = z.infer<typeof d.RatingDtoById>;
export type TRatingDtoByUserId = z.infer<typeof d.RatingDtoByUserId>;
export type TRatingDtoByEntityId = z.infer<typeof d.RatingDtoByEntityId>;

// Public DTOs
export type TRatingDtoPublic = z.infer<typeof d.RatingDtoPublic>; 