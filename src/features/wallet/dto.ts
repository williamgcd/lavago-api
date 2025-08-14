import z from 'zod';

import { zNull } from '@/shared/utils/zod';

export const WalletDto = z.object({
    // ID should be the same as user_id
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    user_id: z.uuid(),

    balance: z.number().min(0).default(0),
    currency: z.enum(['BRL']).default('BRL'),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const WalletDtoCreate = WalletDto.pick({
    user_id: true,
    balance: true,
    currency: true,
})
    .partial()
    .refine(data => {
        return !!data.user_id;
    }, 'User ID is required');

export const WalletDtoDelete = WalletDto.pick({
    id: true,
});

export const WalletDtoFilter = WalletDto.pick({
    user_id: true,
    currency: true,
    balance: true,
}).partial();

export const WalletDtoUpdate = WalletDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
    user_id: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const WalletDtoById = z.object({
    wallet_id: WalletDto.shape.id,
});
export const WalletDtoByUserId = z.object({
    user_id: z.uuid(),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const WalletDtoPublic = WalletDto;
