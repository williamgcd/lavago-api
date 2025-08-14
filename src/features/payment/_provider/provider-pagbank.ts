import { pagbankClient } from '@/providers/pagbank';

import { PagBankCheckoutDto } from './provider-pagbank.dto';
import { IProvider } from './interface';
import { TProviderResponseDto } from './types';

import * as t from './types';

export class ProviderPagBank implements IProvider {
    async authorize(payment: t.TPaymentDto) {
        if (payment.status !== 'waiting') {
            throw new Error('Payment is not waiting for user');
        }
        if (payment.type == 'link') {
            const { provider_id } = payment;
            await pagbankClient.checkoutUpdate(provider_id, 'activate');
            return this.getPaymentById(payment);
        }
        // TODO: Implement authorize function
        return {
            id: payment.id,
            status: 'authorized',
        } as t.TProviderResponseDto;
    }

    async cancel(payment: t.TPaymentDto) {
        if (['authorized', 'pending', 'waiting'].includes(payment.status)) {
            throw new Error('Payment cannot be cancelled');
        }
        if (payment.type == 'link') {
            const { provider_id } = payment;
            await pagbankClient.checkoutUpdate(provider_id, 'activate');
            return this.getPaymentById(payment);
        }
        // TODO: Implement cancel function
        return {
            id: payment.id,
            status: 'cancelled',
        } as t.TProviderResponseDto;
    }

    async capture(payment: t.TPaymentDto) {
        if (payment.type == 'link') {
            const message = 'Payment does not support capture';
            throw new Error(message);
        }
        // TODO: Implement capture function
        return {
            id: payment.id,
            status: 'paid',
        } as t.TProviderResponseDto;
    }

    async create(payment: t.TPaymentDto, user: t.TUserDto) {
        if (payment.type === 'link') {
            return this.createCheckout(payment, user);
        }
        throw new Error('Create method not implemented');
    }

    async createCheckout(payment: t.TPaymentDto, user: t.TUserDto) {
        try {
            const req = PagBankCheckoutDto(payment, user);
            const res = await pagbankClient.checkoutCreate(req, payment.id);
            console.error('ProviderPagBank.create', 'res', res);
            return this.mapResponse(res, 'waiting');
        } catch (err) {
            console.error('ProviderPagBank.create', err);
            throw err;
        }
    }

    async getName() {
        return 'pagbank';
    }

    async getPaymentById(payment: t.TPaymentDto) {
        try {
            const { provider_id } = payment;
            if (!provider_id) {
                console.error('ProviderPagBank.getPaymentById', 'provider_id');
                throw new Error('Payment Info not available');
            }
            if (payment.type === 'link') {
                const res = await pagbankClient.checkoutGetById(provider_id);
                console.log('ProviderPagBank.getPaymentById', 'res', res);
                return this.mapResponse(res, payment.status);
            }
            throw new Error('getPaymentById method not implemented');
            // const res = await pagbankClient.getOrder(provider_id);
            // console.log('ProviderPagBank.getPaymentById', 'res', res);
            // return this.mapResponse(res, payment.status);
        } catch (err) {
            console.error('ProviderPagBank.getPaymentById', err);
            throw err;
        }
    }

    mapResponse(res: any, status: TProviderResponseDto['status'] = 'waiting') {
        return {
            id: res.id,
            status: status,
            link: undefined,
            meta: res,
        } as TProviderResponseDto;
    }
}
