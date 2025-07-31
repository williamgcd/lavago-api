import { createPaymentProvider } from './payment-provider.factory';

// Example usage in your services

export class PaymentService {
    // One-time booking payment (Option 1.a)
    async createOneTimePayment(booking: any) {
        const provider = createPaymentProvider('pagbank');
        
        const paymentLink = await provider.createPaymentLink(
            booking.priceTotal,
            `Lavagem: ${booking.vehicle}`,
            {
                bookingId: booking.id,
                customerName: booking.clientName,
                customerEmail: booking.clientEmail
            }
        );
        
        return {
            paymentId: paymentLink.id,
            paymentUrl: paymentLink.paymentUrl,
            status: paymentLink.status
        };
    }
    
    // Subscription pre-authorization (Option 2.a & 2.b)
    async createSubscriptionPreAuth(subscription: any) {
        const provider = createPaymentProvider('pagbank');
        
        const preAuth = await provider.createPreAuthorization(
            subscription.amount,
            `Assinatura ${subscription.recurrence} - Desconto ${subscription.discountPercentage}%`,
            {
                subscriptionId: subscription.id,
                customerName: subscription.userName,
                customerEmail: subscription.userEmail
            }
        );
        
        return {
            preAuthId: preAuth.id,
            status: preAuth.status,
            expiresAt: preAuth.expiresAt
        };
    }
    
    // Capture pre-auth when booking is completed
    async captureSubscriptionPayment(orderId: string, chargeId: string, amount: number) {
        const provider = createPaymentProvider('pagbank');
        
        const result = await provider.capturePreAuth(orderId, chargeId, amount);
        
        return {
            paymentId: result.id,
            status: result.status
        };
    }
    
    // Check payment status
    async getPaymentStatus(orderId: string, chargeId: string) {
        const provider = createPaymentProvider('pagbank');
        return await provider.getPaymentStatus(orderId, chargeId);
    }
    
    // Refund payment
    async refundPayment(orderId: string, chargeId: string, amount?: number) {
        const provider = createPaymentProvider('pagbank');
        return await provider.refundPayment(orderId, chargeId, amount);
    }
} 