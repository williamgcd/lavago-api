// PagBank API Types based on their documentation

export interface PagBankOrderRequest {
    reference_id: string;
    customer: {
        name?: string;
        email?: string;
        tax_id?: string;
    };
    items: Array<{
        reference_id: string;
        name: string;
        quantity: number;
        unit_amount: number;
    }>;
    charges: Array<{
        reference_id: string;
        description: string;
        amount: {
            value: number;
            currency: string;
        };
        payment_method: {
            type: 'PIX' | 'CREDIT_CARD';
            installments?: number;
            capture?: boolean;
        };
        notification_urls?: string[];
    }>;
}

export interface PagBankOrderResponse {
    id: string;
    reference_id: string;
    created_at: string;
    customer: {
        name: string;
        email: string;
        tax_id: string;
    };
    items: Array<{
        reference_id: string;
        name: string;
        quantity: number;
        unit_amount: number;
    }>;
    charges: Array<{
        id: string;
        reference_id: string;
        status: 'WAITING' | 'AUTHORIZED' | 'PAID' | 'DECLINED' | 'CANCELED';
        created_at: string;
        paid_at?: string;
        expires_at?: string;
        amount: {
            value: number;
            currency: string;
        };
        payment_method: {
            type: 'PIX' | 'CREDIT_CARD';
            installments: number;
        };
        links?: Array<{
            rel: string;
            href: string;
            media: string;
            type: string;
        }>;
    }>;
}

export interface PagBankCaptureRequest {
    amount?: {
        value: number;
        currency: string;
    };
}

export interface PagBankCaptureResponse {
    id: string;
    status: 'PAID' | 'DECLINED';
    amount: {
        value: number;
        currency: string;
    };
}

export interface PagBankRefundRequest {
    amount?: {
        value: number;
        currency: string;
    };
}

export interface PagBankRefundResponse {
    id: string;
    status: 'REFUNDED' | 'DECLINED';
    amount: {
        value: number;
        currency: string;
    };
}

export interface PagBankChargeResponse {
    id: string;
    reference_id: string;
    status: 'WAITING' | 'AUTHORIZED' | 'PAID' | 'DECLINED' | 'CANCELED';
    created_at: string;
    paid_at?: string;
    expires_at?: string;
    amount: {
        value: number;
        currency: string;
    };
    payment_method: {
        type: 'PIX' | 'CREDIT_CARD';
        installments: number;
    };
    links?: Array<{
        rel: string;
        href: string;
        media: string;
        type: string;
    }>;
} 