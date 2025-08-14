import z from 'zod';

import { UserDto } from '../user/dto';
import { validator } from '@/shared/utils/validator';

export const AuthDto = z.object({
    user_id: z.uuid().optional(),
    role: z.literal('client').default('client'),
    email: UserDto.shape.email.optional(),
    phone: UserDto.shape.phone.optional(),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const AuthDtoCreate = AuthDto.omit({
    user_id: true,
}).refine(data => {
    return !!data.email || !!data.phone;
}, 'Email or Phone is required');

/* ************************** */
/* Controller DTOs
/* ************************** */

export const AuthDtoImpersonate = z.object({
    user_id: AuthDto.shape.user_id,
});

export const AuthDtoOtpEmailCheck = z.object({
    email: z.email().transform(validator.email),
    otp: z.string().min(6).max(6).optional(),
});

export const AuthDtoOtpPhoneCheck = z.object({
    phone: z.string().transform(validator.phone),
    otp: z.string().min(6).max(6).optional(),
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const AuthDtoPublic = AuthDto;
