import { IProvider } from './interface';

import * as t from './types';

export class ProviderLocal implements IProvider {
    async authorize(payment: t.TPaymentDto) {
        return {
            id: payment.id,
            status: 'authorized',
        } as t.TProviderResponseDto;
    }

    async cancel(payment: t.TPaymentDto) {
        return {
            id: payment.id,
            status: 'cancelled',
        } as t.TProviderResponseDto;
    }

    async capture(payment: t.TPaymentDto) {
        return {
            id: payment.id,
            status: 'paid',
        } as t.TProviderResponseDto;
    }

    async create(payment: t.TPaymentDto) {
        return {
            id: payment.id,
            status: 'waiting',
            link: undefined,
            meta: { local: true },
        } as t.TProviderResponseDto;
    }

    async getName() {
        return 'local';
    }

    async getPaymentById(payment: t.TPaymentDto) {
        return {} as t.TProviderResponseDto;
    }
}
