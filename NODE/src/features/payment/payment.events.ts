import { TPayment } from "./payment.schema";

export type TPaymentEvents = {
    'payment.created': TPayment;
    'payment.updated': { prev: TPayment, next: TPayment };
    'payment.deleted': { id: string };
    'payment.authorized': TPayment;
    'payment.confirmed': TPayment;
    'payment.failed': TPayment;
    'payment.refunded': TPayment;
    'payment.cancelled': TPayment;
};
