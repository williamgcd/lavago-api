import { TUser } from "./user.schema";

export type TUserEvents = {
    'user.created': TUser;
    'user.deleted': { id: string };
    'user.updated': { prev: TUser, next: TUser };
};