import { CONFIG } from "@/config";
import {
    PagBankOrderRequest,
    PagBankOrderResponse,
    PagBankCaptureRequest,
    PagBankCaptureResponse,
    PagBankRefundRequest,
    PagBankRefundResponse,
    PagBankChargeResponse
} from "./pagbank-client.types";

export class PagBankClient {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    
    constructor(apiKey?: string, baseUrl?: string) {
        this.apiKey = apiKey || CONFIG.pagbank?.apiKey!;
        this.baseUrl = baseUrl || CONFIG.pagbank?.baseUrl || 'https://api.pagbank.com.br';
        
        if (!this.apiKey) {
            throw new Error('PagBank API key is required');
        }
    }
    
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('PagBank API Error:', {
                status: response.status,
                statusText: response.statusText,
                endpoint,
                error: errorText
            });
            throw new Error(`PagBank API error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    }
    
    async createOrder(orderData: PagBankOrderRequest): Promise<PagBankOrderResponse> {
        return this.makeRequest<PagBankOrderResponse>('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }
    
    async getOrder(orderId: string): Promise<PagBankOrderResponse> {
        return this.makeRequest<PagBankOrderResponse>(`/orders/${orderId}`);
    }
    
    async getCharge(orderId: string, chargeId: string): Promise<PagBankChargeResponse> {
        return this.makeRequest<PagBankChargeResponse>(`/orders/${orderId}/charges/${chargeId}`);
    }
    
    async captureCharge(
        orderId: string,
        chargeId: string,
        captureData?: PagBankCaptureRequest
    ): Promise<PagBankCaptureResponse> {
        return this.makeRequest<PagBankCaptureResponse>(
            `/orders/${orderId}/charges/${chargeId}/capture`,
            {
                method: 'POST',
                body: captureData ? JSON.stringify(captureData) : undefined,
            }
        );
    }
    
    async refundCharge(
        orderId: string,
        chargeId: string,
        refundData?: PagBankRefundRequest
    ): Promise<PagBankRefundResponse> {
        return this.makeRequest<PagBankRefundResponse>(
            `/orders/${orderId}/charges/${chargeId}/refunds`,
            {
                method: 'POST',
                body: refundData ? JSON.stringify(refundData) : undefined,
            }
        );
    }
    
    // Helper method to validate webhook signature
    validateWebhookSignature(payload: string, signature: string): boolean {
        // Implementation depends on PagBank's webhook signature method
        // This is a placeholder - you'll need to implement based on their docs
        return true;
    }
} 