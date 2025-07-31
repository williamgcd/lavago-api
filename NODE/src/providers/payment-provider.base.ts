import { PaymentProvider } from "@/providers/payment-provider.types";

export abstract class BasePaymentProvider implements PaymentProvider {
    abstract readonly providerName: string;
    
    abstract createPaymentLink(amount: number, description: string, metadata?: any): Promise<{
        id: string;
        paymentUrl: string;
        status: 'pending';
    }>;
    
    abstract createPreAuthorization(amount: number, description: string, metadata?: any): Promise<{
        id: string;
        status: 'authorized' | 'failed';
        expiresAt?: Date;
    }>;
    
    abstract capturePreAuth(orderId: string, chargeId: string, amount?: number): Promise<{
        id: string;
        status: 'confirmed' | 'failed';
    }>;
    
    abstract getPaymentStatus(orderId: string, chargeId: string): Promise<'pending' | 'authorized' | 'confirmed' | 'failed' | 'refunded'>;
    
    abstract refundPayment(orderId: string, chargeId: string, amount?: number): Promise<{
        id: string;
        status: 'refunded' | 'failed';
    }>;
    
    // Common utility methods that can be shared
    protected formatAmount(amount: number): number {
        // Ensure amount is in cents
        return Math.round(amount * 100);
    }
    
    protected generateReferenceId(prefix: string): string {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    protected handleApiError(error: any, operation: string): never {
        console.error(`Payment provider error in ${operation}:`, error);
        throw new Error(`Payment operation failed: ${operation}`);
    }
} 