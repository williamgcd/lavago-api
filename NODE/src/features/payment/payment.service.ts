import { eventBus } from "@/libs/event-bus-client";

import { TPaymentEvents } from "./payment.events";
import { paymentRepository } from "./payment.repository";
import { TPayment } from "./payment.schema";
import { TPaymentFindQueryDTO } from "./payment.controller.dto";

export const paymentService = {
    create: async (payment: Omit<Partial<TPayment>, 'id'>): Promise<TPayment> => {
        const result = await paymentRepository.create(payment);
        eventBus.emit<TPaymentEvents['payment.created']>('payment.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        await paymentRepository.deleteById(id);
        eventBus.emit<TPaymentEvents['payment.deleted']>('payment.deleted', { id });
    },

    find: async (
        limit: number,
        page: number,
        query?: TPaymentFindQueryDTO,
    ): Promise<{ data: TPayment[], total: number }> => {
        return paymentRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit: number,
        page: number,
        query?: Omit<TPaymentFindQueryDTO, 'userId'>,
    ): Promise<{ data: TPayment[], total: number }> => {
        return paymentRepository.find(limit, page, { userId, ...query });
    },

    getById: async (id: string): Promise<TPayment> => {
        return paymentRepository.getById(id);
    },

    getByUserId: async (userId: string): Promise<TPayment[]> => {
        return paymentRepository.getByUserId(userId);
    },

    getByProviderId: async (paymentProviderId: string): Promise<TPayment> => {
        return paymentRepository.getByProviderId(paymentProviderId);
    },

    updateById: async (id: string, payment: Partial<TPayment>): Promise<TPayment> => {
        const prev = await paymentRepository.getById(id);
        const next = await paymentRepository.updateById(id, payment);
        eventBus.emit<TPaymentEvents['payment.updated']>('payment.updated', { prev, next });
        return next;
    },

    authorize: async (id: string): Promise<TPayment> => {
        const payment = await paymentRepository.updateById(id, { status: 'authorized' });
        eventBus.emit<TPaymentEvents['payment.authorized']>('payment.authorized', payment);
        return payment;
    },

    confirm: async (id: string): Promise<TPayment> => {
        const payment = await paymentRepository.updateById(id, { status: 'confirmed' });
        eventBus.emit<TPaymentEvents['payment.confirmed']>('payment.confirmed', payment);
        return payment;
    },

    fail: async (id: string): Promise<TPayment> => {
        const payment = await paymentRepository.updateById(id, { status: 'failed' });
        eventBus.emit<TPaymentEvents['payment.failed']>('payment.failed', payment);
        return payment;
    },

    refund: async (id: string): Promise<TPayment> => {
        const payment = await paymentRepository.updateById(id, { status: 'refunded' });
        eventBus.emit<TPaymentEvents['payment.refunded']>('payment.refunded', payment);
        return payment;
    },

    cancel: async (id: string): Promise<TPayment> => {
        const payment = await paymentRepository.updateById(id, { status: 'cancelled' });
        eventBus.emit<TPaymentEvents['payment.cancelled']>('payment.cancelled', payment);
        return payment;
    },

    incrementRetryCount: async (id: string): Promise<TPayment> => {
        const payment = await paymentRepository.getById(id);
        const newRetryCount = (payment.retryCount || 0) + 1;
        return paymentRepository.updateById(id, { 
            retryCount: newRetryCount,
            retryAttemptAt: new Date()
        });
    },
};
