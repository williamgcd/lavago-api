import { z } from 'zod';
import { userDTO } from './user.dto';

export const userCreateDTO = userDTO.pick({
    phone: true
});
export type TUserCreateDTO = z.infer<typeof userCreateDTO>;

export const userFindQueryDTO = userDTO.pick({
    name: true,
    email: true,
    phone: true,
    document: true,
}).partial();
export type TUserFindQueryDTO = z.infer<typeof userFindQueryDTO>;

export const userGetByEmailDTO = userDTO.pick({ email: true }).required();
export type TUserGetByEmailDTO = z.infer<typeof userGetByEmailDTO>;

export const userGetByPhoneDTO = userDTO.pick({ phone: true }).required();
export type TUserGetByPhoneDTO = z.infer<typeof userGetByPhoneDTO>;

export const userOtpCheckDTO = userDTO.pick({ phone: true }).extend({
    phoneOtp: z.string(),
}).required();
export type TUserOtpCheckDTO = z.infer<typeof userOtpCheckDTO>;

export const userUpdateDTO = userDTO.partial().extend({
    phoneVerifiedAt: z.date().optional(),
    phoneOtp: z.string().optional(),
    phoneOtpDate: z.date().optional(),
});
export type TUserUpdateDTO = z.infer<typeof userUpdateDTO>;