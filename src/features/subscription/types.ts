import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TSubscriptionDto = z.infer<typeof d.SubscriptionDto>;

// Default CRUD DTOs
export type TSubscriptionDtoCreate = z.infer<typeof d.SubscriptionDtoCreate>;
export type TSubscriptionDtoDelete = z.infer<typeof d.SubscriptionDtoDelete>;
export type TSubscriptionDtoFilter = z.infer<typeof d.SubscriptionDtoFilter>;
export type TSubscriptionDtoUpdate = z.infer<typeof d.SubscriptionDtoUpdate>;

// Controller DTOs
export type TSubscriptionDtoById = z.infer<typeof d.SubscriptionDtoById>;
export type TSubscriptionDtoByPlanId = z.infer<typeof d.SubscriptionDtoByPlanId>;
export type TSubscriptionDtoByUserId = z.infer<typeof d.SubscriptionDtoByUserId>;

// Public DTOs
export type TSubscriptionDtoPublic = z.infer<typeof d.SubscriptionDtoPublic>;
