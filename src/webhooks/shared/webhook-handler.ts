import { Request, Response } from 'express';
import crypto from 'crypto';

export interface WebhookConfig {
    secret: string;
    signatureHeader: string;
    algorithm?: string;
}

export interface WebhookHandlerOptions {
    config: WebhookConfig;
    onSuccess?: (payload: any, signature: string) => Promise<void>;
    onError?: (error: Error, payload?: any) => Promise<void>;
    validatePayload?: (payload: any) => boolean;
}

export class WebhookHandler {
    private config: WebhookConfig;
    private onSuccess?: (payload: any, signature: string) => Promise<void>;
    private onError?: (error: Error, payload?: any) => Promise<void>;
    private validatePayload?: (payload: any) => boolean;

    constructor(options: WebhookHandlerOptions) {
        this.config = options.config;
        this.onSuccess = options.onSuccess;
        this.onError = options.onError;
        this.validatePayload = options.validatePayload;
    }

    /**
     * Handle webhook request
     */
    async handle(req: Request, res: Response): Promise<void> {
        try {
            // Get the raw body for signature verification
            const rawBody = this.getRawBody(req);
            const signature = this.getSignature(req);

            if (!signature) {
                throw new Error('Missing webhook signature');
            }

            // Verify signature
            if (!this.verifySignature(rawBody, signature)) {
                throw new Error('Invalid webhook signature');
            }

            // Parse payload
            const payload = this.parsePayload(req);

            // Validate payload if validator is provided
            if (this.validatePayload && !this.validatePayload(payload)) {
                throw new Error('Invalid webhook payload');
            }

            // Process webhook
            if (this.onSuccess) {
                await this.onSuccess(payload, signature);
            }

            // Return success response
            res.status(200).json({ 
                status: 'success',
                message: 'Webhook processed successfully'
            });

        } catch (error) {
            console.error('Webhook handler error:', error);

            // Call error handler if provided
            if (this.onError) {
                try {
                    await this.onError(error as Error, req.body);
                } catch (handlerError) {
                    console.error('Webhook error handler failed:', handlerError);
                }
            }

            // Return error response
            res.status(400).json({
                status: 'error',
                message: error instanceof Error ? error.message : 'Webhook processing failed'
            });
        }
    }

    /**
     * Get raw body from request
     */
    private getRawBody(req: Request): string {
        // If body is already parsed as JSON, we need to stringify it back
        if (typeof req.body === 'object') {
            return JSON.stringify(req.body);
        }
        
        // If body is a string, return as is
        if (typeof req.body === 'string') {
            return req.body;
        }

        // Fallback to empty string
        return '';
    }

    /**
     * Get signature from request headers
     */
    private getSignature(req: Request): string | null {
        const signature = req.headers[this.config.signatureHeader.toLowerCase()];
        
        if (Array.isArray(signature)) {
            return signature[0] || null;
        }
        
        return signature || null;
    }

    /**
     * Verify webhook signature
     */
    private verifySignature(payload: string, signature: string): boolean {
        try {
            const algorithm = this.config.algorithm || 'sha256';
            const expectedSignature = crypto
                .createHmac(algorithm, this.config.secret)
                .update(payload, 'utf8')
                .digest('hex');

            // Compare signatures (constant-time comparison to prevent timing attacks)
            return crypto.timingSafeEqual(
                Buffer.from(signature, 'hex'),
                Buffer.from(expectedSignature, 'hex')
            );
        } catch (error) {
            console.error('Signature verification error:', error);
            return false;
        }
    }

    /**
     * Parse payload from request
     */
    private parsePayload(req: Request): any {
        // If body is already parsed, return it
        if (req.body && typeof req.body === 'object') {
            return req.body;
        }

        // Try to parse as JSON
        try {
            return JSON.parse(req.body || '{}');
        } catch (error) {
            console.error('Failed to parse webhook payload:', error);
            return {};
        }
    }

    /**
     * Create a middleware function for Express
     */
    static createMiddleware(options: WebhookHandlerOptions) {
        const handler = new WebhookHandler(options);
        return (req: Request, res: Response) => handler.handle(req, res);
    }
}

export default WebhookHandler;
