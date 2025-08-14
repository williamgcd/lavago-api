import z from 'zod';

import { normalizer } from '@/shared/utils/normalizer';
import { validator } from '@/shared/utils/validator';
import { zNull } from '@/shared/utils/zod';

import { ENUMS } from './enums';
import { formatter } from '@/shared/utils/formatter';

export const UserDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    role: z.enum(ENUMS.ROLE).default('client'),
    name: zNull(z.string().min(2).max(100)),

    document: zNull(z.string().min(2).max(100).transform(normalizer.document)),
    document_type: z.enum(ENUMS.DOCUMENT_TYPE).default('cpf'),

    email: zNull(z.email().transform(validator.email)),
    email_otp: zNull(z.string().min(6).max(6)),
    email_otp_expires_at: zNull(z.coerce.date()),
    email_otp_checked_at: zNull(z.coerce.date()),

    phone: zNull(z.string().transform(validator.phone)),
    phone_otp: zNull(z.string().min(6).max(6)),
    phone_otp_expires_at: zNull(z.coerce.date()),
    phone_otp_checked_at: zNull(z.coerce.date()),

    referral: zNull(z.string().min(6).max(100)),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const UserDtoCreate = UserDto.pick({
    role: true,
    name: true,
    document: true,
    document_type: true,
    email: true,
    phone: true,
})
    .partial()
    .refine(data => {
        return !!data.email || !!data.phone;
    }, 'Email or Phone is required')
    .refine(data => {
        return !['admin', 'super'].includes(data.role);
    }, 'Cannot create user with role of admin');

export const UserDtoFilter = UserDto.pick({
    role: true,
    email: true,
    phone: true,
})
    .extend({
        user_ids: z.array(UserDto.shape.id),
    })
    .partial();

export const UserDtoUpdate = UserDto.pick({
    name: true,
    document: true,
    document_type: true,
    email: true,
    phone: true,
});

/* ************************** */
/* Controller DTOs
/* ************************** */

export const UserDtoById = z.object({
    user_id: UserDto.shape.id,
});
export const UserDtoByEmail = z.object({
    email: UserDto.shape.email,
});
export const UserDtoByPhone = z.object({
    phone: UserDto.shape.phone,
});
export const UserDtoByReferral = z.object({
    referral: UserDto.shape.referral,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const UserDtoPublic = UserDto.omit({
    email_otp: true,
    email_otp_expires_at: true,
    phone_otp: true,
    phone_otp_expires_at: true,
}).transform(data => ({
    ...data,
    document: formatter.document(data.document),
    phone: formatter.phone(data.phone),
}));
