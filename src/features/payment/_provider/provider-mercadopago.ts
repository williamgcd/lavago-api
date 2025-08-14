import { IProvider } from './interface';

import * as t from './types';

export class ProviderMercadoPago implements Partial<IProvider> {
    async authorize(payment: t.TPaymentDto) {
        // TODO: Implement authorize function
        return {
            id: payment.id,
            status: 'authorized',
        } as t.TProviderResponseDto;
    }

    async cancel(payment: t.TPaymentDto) {
        // TODO: Implement cancel function
        return {
            id: payment.id,
            status: 'cancelled',
        } as t.TProviderResponseDto;
    }

    async capture(payment: t.TPaymentDto) {
        // TODO: Implement capture function
        return {
            id: payment.id,
            status: 'paid',
        } as t.TProviderResponseDto;
    }

    async create(payment: t.TPaymentDto) {
        // TODO: Implement create function
        return {
            id: payment.id,
            status: 'waiting',
        } as t.TProviderResponseDto;
    }

    async getName() {
        return 'mercadopago';
    }

    async getPaymentById(payment: t.TPaymentDto) {
        return {
            id: payment.id,
            status: payment.status,
        } as t.TProviderResponseDto;
    }
}
