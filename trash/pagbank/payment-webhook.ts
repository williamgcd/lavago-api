import { Request, Response } from 'express';
import {
    WebhookHandler,
    WebhookHandlerOptions,
} from '../shared/webhook-handler';
import { PagBankWebhookPayload } from '@/providers/pagbank';
import { paymentService } from '@/features/payment/service';
import { getProvider } from '@/features/payment/_provider';

export interface PagBankWebhookConfig {
    secret: string;
    signatureHeader?: string;
}

export class PagBankPaymentWebhook {
    private handler: WebhookHandler;

    constructor(config: PagBankWebhookConfig) {
        const options: WebhookHandlerOptions = {
            config: {
                secret: config.secret,
                signatureHeader:
                    config.signatureHeader || 'x-pagbank-signature',
                algorithm: 'sha256',
            },
            onSuccess: this.handleWebhookSuccess.bind(this),
            onError: this.handleWebhookError.bind(this),
            validatePayload: this.validatePayload.bind(this),
        };

        this.handler = new WebhookHandler(options);
    }

    /**
     * Handle webhook request
     */
    async handle(req: Request, res: Response): Promise<void> {
        await this.handler.handle(req, res);
    }

    /**
     * Validate webhook payload
     */
    private validatePayload(payload: any): boolean {
        // Check if payload has required structure
        if (!payload || typeof payload !== 'object') {
            return false;
        }

        // Check if it's a payment webhook
        if (payload.type !== 'PAYMENT_NOTIFICATION') {
            return false;
        }

        // Check if data exists
        if (!payload.data || !payload.data.id) {
            return false;
        }

        // Check if attributes exist
        if (!payload.data.attributes || !payload.data.attributes.status) {
            return false;
        }

        return true;
    }

    /**
     * Handle successful webhook
     */
    private async handleWebhookSuccess(
        payload: PagBankWebhookPayload,
        signature: string
    ): Promise<void> {
        try {
            console.log('Processing PagBank payment webhook:', {
                webhookId: payload.id,
                paymentId: payload.data.id,
                status: payload.data.attributes.status,
            });

            const provider = getProvider('pagbank');
            const paymentId = payload.data.id;
            const status = payload.data.attributes.status;

            // Get our payment record by provider ID
            const payment = await paymentService.getByProviderId(paymentId);

            // Map provider status to our status
            const mappedStatus = provider.mapStatus(status);

            // Update payment status
            const updateData: any = {
                status: mappedStatus,
                provider_meta: {
                    ...payment.provider_meta,
                    last_webhook: {
                        id: payload.id,
                        type: payload.type,
                        received_at: new Date().toISOString(),
                        signature: signature,
                        status: status,
                    },
                },
            };

            // Set captured_at if payment is captured
            if (mappedStatus === 'captured') {
                updateData.captured_at = new Date();
            }

            // Set expires_at if provided
            if (payload.data.attributes.expires_at) {
                updateData.expires_at = new Date(
                    payload.data.attributes.expires_at
                );
            }

            // Update payment
            await paymentService.update(payment.id, updateData);

            console.log('PagBank payment webhook processed successfully:', {
                paymentId: payment.id,
                providerId: paymentId,
                oldStatus: payment.status,
                newStatus: mappedStatus,
            });
        } catch (error) {
            console.error('Error processing PagBank payment webhook:', error);
            throw error;
        }
    }

    /**
     * Handle webhook error
     */
    private async handleWebhookError(
        error: Error,
        payload?: any
    ): Promise<void> {
        console.error('PagBank payment webhook error:', {
            error: error.message,
            payload: payload,
            timestamp: new Date().toISOString(),
        });

        // TODO: Implement error handling logic
        // - Log to monitoring system
        // - Send alert to team
        // - Retry processing if appropriate
    }

    /**
     * Create middleware function for Express
     */
    static createMiddleware(config: PagBankWebhookConfig) {
        const webhook = new PagBankPaymentWebhook(config);
        return (req: Request, res: Response) => webhook.handle(req, res);
    }
}

export default PagBankPaymentWebhook;
