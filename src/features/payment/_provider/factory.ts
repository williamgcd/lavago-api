import { CONFIG } from '@/config';
import { ProviderLocal } from './provider-local';
import { ProviderMercadoPago } from './provider-mercadopago';
import { ProviderPagBank } from './provider-pagbank';
import { IProvider } from './interface';

export const createProvider = (provider: string) => {
    const providers = {
        local: new ProviderLocal(),
        mercadopago: new ProviderMercadoPago(),
        pagbank: new ProviderPagBank(),
    };
    if (CONFIG.NODE_ENV === 'development') {
        // We always use the local payment provider on dev.
        return providers['local'] as IProvider;
    }
    if (!Object.keys(providers).includes(provider)) {
        console.error('payment.provider.factory.createProvider', 'NotFound');
        throw new Error(`Provider not found: ${provider}`);
    }
    return providers[provider] as IProvider;
};
