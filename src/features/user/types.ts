import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TUserDto = z.infer<typeof d.UserDto>;

// Default CRUD DTOs
export type TUserDtoCreate = z.infer<typeof d.UserDtoCreate>;
export type TUserDtoFilter = z.infer<typeof d.UserDtoFilter>;
export type TUserDtoUpdate = z.infer<typeof d.UserDtoUpdate>;

// Controller DTOs
export type TUserDtoById = z.infer<typeof d.UserDtoById>;
export type TUserDtoByEmail = z.infer<typeof d.UserDtoByEmail>;
export type TUserDtoByPhone = z.infer<typeof d.UserDtoByPhone>;
export type TUserDtoByReferral = z.infer<typeof d.UserDtoByReferral>;

// Public DTOs
export type TUserDtoPublic = z.infer<typeof d.UserDtoPublic>;
