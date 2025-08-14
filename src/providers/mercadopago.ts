import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface MercadoPagoConfig {
    accessToken: string;
    environment: 'sandbox' | 'production';
    timeout: number;
}

export interface MercadoPagoOrderRequest {
    type: 'online';
    external_reference: string;
    total_amount: string;
    description: string;
    payer: {
        email: string;
        entity_type: 'individual' | 'association';
        first_name: string;
        last_name: string;
        identification: {
            type: 'CPF' | 'CNPJ';
            number: string;
        };
        phone?: {
            area_code: string;
            number: string;
        };
        address?: {
            zip_code: string;
            street_name: string;
            street_number: string;
            neighborhood: string;
            state: string;
            city: string;
            complement?: string;
        };
    };
    transactions: {
        payments: Array<{
            amount: string;
            payment_method: {
                id: string;
                type: 'credit_card' | 'debit_card' | 'pix' | 'boleto';
                token?: string;
                installments?: number;
                statement_descriptor?: string;
            };
            expiration_time?: string;
        }>;
    };
    items?: Array<{
        title: string;
        unit_price: string;
        quantity: number;
        description?: string;
        external_code?: string;
    }>;
    capture_mode?: 'automatic_async' | 'manual';
    processing_mode?: 'automatic' | 'manual';
}

export interface MercadoPagoOrderResponse {
    id: string;
    type: string;
    processing_mode: string;
    external_reference: string;
    total_amount: string;
    total_paid_amount: string;
    created_date: string;
    last_updated_date: string;
    country_code: string;
    status: string;
    status_detail: string;
    capture_mode: string;
    description: string;
    transactions: {
        payments: Array<{
            id: string;
            amount: string;
            paid_amount: string;
            reference_id: string;
            status: string;
            status_detail: string;
            expiration_time?: string;
            payment_method: {
                id: string;
                type: string;
                token?: string;
                installments?: number;
                statement_descriptor?: string;
                qr_code?: string;
                qr_code_base64?: string;
                barcode_content?: string;
                digitable_line?: string;
            };
            date_of_expiration?: string;
        }>;
    };
    items?: Array<{
        title: string;
        unit_price: string;
        quantity: number;
        description?: string;
        external_code?: string;
    }>;
    client_token?: string;
}

export interface MercadoPagoWebhookPayload {
    id: string;
    type: string;
    created_at: string;
    data: {
        id: string;
        type: string;
        attributes: {
            status: string;
            status_detail: string;
            amount: string;
            payment_method: {
                id: string;
                type: string;
            };
            created_at: string;
            updated_at: string;
        };
    };
}

class MercadoPagoClient {
    private config: MercadoPagoConfig;
    private client: AxiosInstance;

    constructor(config: MercadoPagoConfig) {
        this.config = config;
        this.client = axios.create({
            baseURL: 'https://api.mercadopago.com',
            timeout: config.timeout || 30000,
            headers: {
                'Authorization': `Bearer ${config.accessToken}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': '', // Will be set per request
            },
        });

        // Add request interceptor for logging
        this.client.interceptors.request.use(
            (config) => {
                console.log('MercadoPago API Request:', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    data: config.data,
                });
                return config;
            },
            (error) => {
                console.error('MercadoPago API Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor for logging
        this.client.interceptors.response.use(
            (response) => {
                console.log('MercadoPago API Response:', {
                    status: response.status,
                    data: response.data,
                });
                return response;
            },
            (error) => {
                console.error('MercadoPago API Response Error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                });
                return Promise.reject(error);
            }
        );
    }

    /**
     * Create a new order
     */
    async createOrder(
        orderData: MercadoPagoOrderRequest,
        idempotencyKey?: string
    ): Promise<MercadoPagoOrderResponse> {
        try {
            const headers: Record<string, string> = {};
            if (idempotencyKey) {
                headers['X-Idempotency-Key'] = idempotencyKey;
            }

            const response: AxiosResponse<MercadoPagoOrderResponse> = await this.client.post(
                '/v1/orders',
                orderData,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('MercadoPago createOrder error:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Get order details
     */
    async getOrder(orderId: string): Promise<MercadoPagoOrderResponse> {
        try {
            const response: AxiosResponse<MercadoPagoOrderResponse> = await this.client.get(
                `/v1/orders/${orderId}`
            );

            return response.data;
        } catch (error) {
            console.error('MercadoPago getOrder error:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Capture an order
     */
    async captureOrder(
        orderId: string,
        idempotencyKey?: string
    ): Promise<MercadoPagoOrderResponse> {
        try {
            const headers: Record<string, string> = {};
            if (idempotencyKey) {
                headers['X-Idempotency-Key'] = idempotencyKey;
            }

            const response: AxiosResponse<MercadoPagoOrderResponse> = await this.client.post(
                `/v1/orders/${orderId}/capture`,
                {},
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('MercadoPago captureOrder error:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Cancel an order
     */
    async cancelOrder(
        orderId: string,
        idempotencyKey?: string
    ): Promise<MercadoPagoOrderResponse> {
        try {
            const headers: Record<string, string> = {};
            if (idempotencyKey) {
                headers['X-Idempotency-Key'] = idempotencyKey;
            }

            const response: AxiosResponse<MercadoPagoOrderResponse> = await this.client.post(
                `/v1/orders/${orderId}/cancel`,
                {},
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('MercadoPago cancelOrder error:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload: string, signature: string): boolean {
        // TODO: Implement webhook signature verification
        console.log('Webhook signature verification not implemented yet');
        return true;
    }

    /**
     * Map MercadoPago status to our payment status
     */
    mapStatus(mercadopagoStatus: string): string {
        const statusMap: Record<string, string> = {
            'processed': 'captured',
            'pending': 'pending',
            'rejected': 'failed',
            'cancelled': 'cancelled',
            'expired': 'expired',
            'authorized': 'authorized',
            'in_process': 'processing',
        };

        return statusMap[mercadopagoStatus] || 'pending';
    }

    /**
     * Handle API errors
     */
    private handleError(error: any): Error {
        if (error.response) {
            const { status, data } = error.response;
            const message = data?.message || data?.error || 'Unknown error';
            
            return new Error(`MercadoPago API Error (${status}): ${message}`);
        }
        
        return new Error(`MercadoPago API Error: ${error.message}`);
    }
}

// Create and export a singleton instance
let mercadopagoClient: MercadoPagoClient | null = null;

export const createMercadoPagoClient = (config: MercadoPagoConfig): MercadoPagoClient => {
    if (!mercadopagoClient) {
        mercadopagoClient = new MercadoPagoClient(config);
    }
    return mercadopagoClient;
};

export const getMercadoPagoClient = (): MercadoPagoClient => {
    if (!mercadopagoClient) {
        throw new Error('MercadoPago client not initialized. Call createMercadoPagoClient first.');
    }
    return mercadopagoClient;
};

export { MercadoPagoClient };
export default MercadoPagoClient;
