export interface PaymentProvider {
    // One-time payments (PIX/Credit card)
    createPaymentLink(amount: number, description: string, metadata?: any): Promise<{
        id: string;
        paymentUrl: string;
        status: 'pending';
    }>;
    
    // Pre-authorization for subscriptions (Credit card)
    createPreAuthorization(amount: number, description: string, metadata?: any): Promise<{
        id: string;
        status: 'authorized' | 'failed';
        expiresAt?: Date;
    }>;
    
    // Capture pre-authorization
    capturePreAuth(orderId: string, chargeId: string, amount?: number): Promise<{
        id: string;
        status: 'confirmed' | 'failed';
    }>;
    
    // Common operations
    getPaymentStatus(orderId: string, chargeId: string): Promise<'pending' | 'authorized' | 'confirmed' | 'failed' | 'refunded'>;
    refundPayment(orderId: string, chargeId: string, amount?: number): Promise<{
        id: string;
        status: 'refunded' | 'failed';
    }>;
}

export type PaymentProviderName = 'pagbank' | 'mercadopago' | 'stripe'; 