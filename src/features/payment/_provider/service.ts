import { userService } from '@/features/user/service';

import { TPaymentDto } from '../types';

import * as d from './dto';
import * as t from './types';
import { createProvider } from './factory';

const serv = {
    authorize: async (payment: TPaymentDto) => {
        const provider = createProvider(payment.provider);
        try {
            const record = await provider.authorize(payment);
            return d.ProviderResponseDto.parse(record);
        } catch (err) {
            console.error('payment.provider.serv.authorize', err);
            throw err;
        }
    },

    cancel: async (payment: TPaymentDto) => {
        const provider = createProvider(payment.provider);
        try {
            const record = await provider.cancel(payment);
            return d.ProviderResponseDto.parse(record);
        } catch (err) {
            console.error('payment.provider.serv.cancel', err);
            throw err;
        }
    },

    capture: async (payment: TPaymentDto) => {
        const provider = createProvider(payment.provider);
        try {
            const record = await provider.capture(payment);
            return d.ProviderResponseDto.parse(record);
        } catch (err) {
            console.error('payment.provider.serv.capture', err);
            throw err;
        }
    },

    create: async (payment: TPaymentDto) => {
        const provider = createProvider(payment.provider);
        const user = await userService.getById(payment.user_id);

        try {
            const record = await provider.create(payment, user);
            return d.ProviderResponseDto.parse(record);
        } catch (err) {
            console.error('payment.provider.serv.create', err);
            throw err;
        }
    },

    getProvider: async (payment: TPaymentDto) => {
        return createProvider(payment.provider);
    },

    getPaymentById: async (payment: TPaymentDto) => {
        const provider = createProvider(payment.provider);
        try {
            const record = await provider.getPaymentById(payment);
            return d.ProviderResponseDto.parse(record);
        } catch (err) {
            console.error('payment.provider.serv.getPaymentById', err);
            throw err;
        }
    },
};

export { serv, serv as providerService };
