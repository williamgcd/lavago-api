import { BasePaymentProvider } from "./payment-provider.base";
import { PagBankClient } from "@/libs/pagbank-client";
import { CONFIG } from "@/config";

export class PagBankProvider extends BasePaymentProvider {
    readonly providerName = 'pagbank';
    private readonly client: PagBankClient;
    
    constructor() {
        super();
        this.client = new PagBankClient();
    }
    
    async createPaymentLink(amount: number, description: string, metadata?: any) {
        try {
            const orderData = {
                reference_id: this.generateReferenceId('booking'),
                customer: {
                    name: metadata?.customerName,
                    email: metadata?.customerEmail,
                    tax_id: metadata?.customerTaxId
                },
                items: [{
                    reference_id: metadata?.bookingId || 'item_1',
                    name: description,
                    quantity: 1,
                    unit_amount: this.formatAmount(amount)
                }],
                charges: [{
                    reference_id: this.generateReferenceId('charge'),
                    description: description,
                    amount: {
                        value: this.formatAmount(amount),
                        currency: 'BRL'
                    },
                    payment_method: {
                        type: 'PIX' as const
                    },
                    notification_urls: [`${CONFIG.baseUrl}/webhooks/pagbank`]
                }]
            };
            
            const response = await this.client.createOrder(orderData);
            const charge = response.charges[0];
            
            return {
                id: charge.id,
                paymentUrl: charge.links?.[0]?.href || '',
                status: 'pending' as const
            };
        } catch (error) {
            this.handleApiError(error, 'createPaymentLink');
        }
    }
    
    async createPreAuthorization(amount: number, description: string, metadata?: any) {
        try {
            const orderData = {
                reference_id: this.generateReferenceId('subscription'),
                customer: {
                    name: metadata?.customerName,
                    email: metadata?.customerEmail,
                    tax_id: metadata?.customerTaxId
                },
                items: [{
                    reference_id: metadata?.subscriptionId || 'item_1',
                    name: description,
                    quantity: 1,
                    unit_amount: this.formatAmount(amount)
                }],
                charges: [{
                    reference_id: this.generateReferenceId('charge'),
                    description: description,
                    amount: {
                        value: this.formatAmount(amount),
                        currency: 'BRL'
                    },
                    payment_method: {
                        type: 'CREDIT_CARD' as const,
                        installments: 1,
                        capture: false // This makes it a pre-authorization
                    },
                    notification_urls: [`${CONFIG.baseUrl}/webhooks/pagbank`]
                }]
            };
            
            const response = await this.client.createOrder(orderData);
            const charge = response.charges[0];
            
            return {
                id: charge.id,
                status: charge.status === 'AUTHORIZED' ? 'authorized' as const : 'failed' as const,
                expiresAt: charge.expires_at ? new Date(charge.expires_at) : undefined
            };
        } catch (error) {
            this.handleApiError(error, 'createPreAuthorization');
        }
    }
    
    async capturePreAuth(orderId: string, chargeId: string, amount?: number) {
        try {
            const captureData = amount ? {
                amount: {
                    value: this.formatAmount(amount),
                    currency: 'BRL'
                }
            } : undefined;
            
            const response = await this.client.captureCharge(orderId, chargeId, captureData);
            
            return {
                id: response.id,
                status: response.status === 'PAID' ? 'confirmed' as const : 'failed' as const
            };
        } catch (error) {
            this.handleApiError(error, 'capturePreAuth');
        }
    }
    
    async getPaymentStatus(orderId: string, chargeId: string) {
        try {
            const response = await this.client.getCharge(orderId, chargeId);
            
            switch (response.status) {
                case 'PAID':
                    return 'confirmed';
                case 'AUTHORIZED':
                    return 'authorized';
                case 'WAITING':
                    return 'pending';
                case 'DECLINED':
                case 'CANCELED':
                    return 'failed';
                default:
                    return 'failed';
            }
        } catch (error) {
            this.handleApiError(error, 'getPaymentStatus');
        }
    }
    
    async refundPayment(orderId: string, chargeId: string, amount?: number) {
        try {
            const refundData = amount ? {
                amount: {
                    value: this.formatAmount(amount),
                    currency: 'BRL'
                }
            } : undefined;
            
            const response = await this.client.refundCharge(orderId, chargeId, refundData);
            
            return {
                id: response.id,
                status: response.status === 'REFUNDED' ? 'refunded' as const : 'failed' as const
            };
        } catch (error) {
            this.handleApiError(error, 'refundPayment');
        }
    }
}
