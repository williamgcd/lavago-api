import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TWalletDto = z.infer<typeof d.WalletDto>;

// Default CRUD DTOs
export type TWalletDtoCreate = z.infer<typeof d.WalletDtoCreate>;
export type TWalletDtoDelete = z.infer<typeof d.WalletDtoDelete>;
export type TWalletDtoFilter = z.infer<typeof d.WalletDtoFilter>;
export type TWalletDtoUpdate = z.infer<typeof d.WalletDtoUpdate>;

// Controller DTOs
export type TWalletDtoById = z.infer<typeof d.WalletDtoById>;
export type TWalletDtoByUserId = z.infer<typeof d.WalletDtoByUserId>;

// Public DTOs
export type TWalletDtoPublic = z.infer<typeof d.WalletDtoPublic>;
