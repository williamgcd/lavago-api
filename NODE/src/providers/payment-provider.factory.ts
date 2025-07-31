import { PaymentProvider, PaymentProviderName } from "@/providers/payment-provider.types";
import { PagBankProvider } from "./pagbank-provider";

export function createPaymentProvider(provider: PaymentProviderName): PaymentProvider {
    switch (provider) {
        case 'pagbank':
            return new PagBankProvider();
        case 'mercadopago':
            // TODO: Implement MercadoPago provider
            throw new Error('MercadoPago provider not implemented yet');
        case 'stripe':
            // TODO: Implement Stripe provider
            throw new Error('Stripe provider not implemented yet');
        default:
            throw new Error(`Unknown payment provider: ${provider}`);
    }
}

// Helper function to get available providers
export function getAvailableProviders(): PaymentProviderName[] {
    return ['pagbank']; // Add more as they're implemented
}

// Helper function to check if a provider is available
export function isProviderAvailable(provider: PaymentProviderName): boolean {
    return getAvailableProviders().includes(provider);
} 