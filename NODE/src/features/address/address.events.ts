import { TAddress } from './address.schema';

export type TAddressEvents = {
    'address.created': TAddress;
    'address.updated': { prev: TAddress; next: TAddress };
    'address.deleted': { id: string; userId: string;};
}