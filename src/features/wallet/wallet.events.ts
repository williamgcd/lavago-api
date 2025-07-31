import { TWallet } from './wallet.schema';

export type TWalletEvents = {
    'wallet.created': TWallet;
    'wallet.updated': { prev: TWallet; next: TWallet };
    'wallet.deleted': { id: string; userId: string;};
}
