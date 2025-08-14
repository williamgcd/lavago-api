import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TCouponDto = z.infer<typeof d.CouponDto>;

// Default CRUD DTOs
export type TCouponDtoCreate = z.infer<typeof d.CouponDtoCreate>;
export type TCouponDtoDelete = z.infer<typeof d.CouponDtoDelete>;
export type TCouponDtoFilter = z.infer<typeof d.CouponDtoFilter>;
export type TCouponDtoUpdate = z.infer<typeof d.CouponDtoUpdate>;

// Controller DTOs
export type TCouponDtoById = z.infer<typeof d.CouponDtoById>;
export type TCouponDtoByCode = z.infer<typeof d.CouponDtoByCode>;

// Public DTOs
export type TCouponDtoPublic = z.infer<typeof d.CouponDtoPublic>; 