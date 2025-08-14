import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TAddressDto = z.infer<typeof d.AddressDto>;

// Default CRUD DTOs
export type TAddressDtoCreate = z.infer<typeof d.AddressDtoCreate>;
export type TAddressDtoDelete = z.infer<typeof d.AddressDtoDelete>;
export type TAddressDtoFilter = z.infer<typeof d.AddressDtoFilter>;
export type TAddressDtoUpdate = z.infer<typeof d.AddressDtoUpdate>;

// Controller DTOs
export type TAddressDtoById = z.infer<typeof d.AddressDtoById>;

// Public DTOs
export type TAddressDtoPublic = z.infer<typeof d.AddressDtoPublic>;
