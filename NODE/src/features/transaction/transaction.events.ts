import { TTransaction } from './transaction.schema';

export type TTransactionEvents = {
    'transaction.created': TTransaction;
    'transaction.updated': { prev: TTransaction; next: TTransaction };
    'transaction.deleted': { id: string; userId: string;};

    'transaction.updated.status': { id: string; prevStatus: string; nextStatus: string };
    'transaction.updated.status.CANCELLED': TTransaction;
    'transaction.updated.status.COMPLETED': TTransaction;
    'transaction.updated.status.FAILED': TTransaction;
    'transaction.updated.status.PENDING': TTransaction;
}
