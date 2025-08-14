import { Request, Response, NextFunction } from 'express';
import { TPaymentDto } from '@/features/payment/types';
import { paymentService } from '@/features/payment/service';

import { parseBody } from '../shared/parse-body';

export const paymentPagbankWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get the body from the request.
    const body = parseBody(req);
    if (!body) {
        console.error('paymentPagbankWebhook', 'NotFound', body);
        throw new Error('Body not found');
    }

    let payment: TPaymentDto;

    // Check if there is a payment_id on the url
    const { payment_id } = req.params;
    if (payment_id) {
        // Get the payment from the params
        payment = await paymentService.getById(payment_id);
    } else {
        // Extract the providerId from the request body
        const provider_id = body.reference_id;
        if (provider_id) {
            payment = await paymentService.getById(payment_id);
        }
    }

    if (!payment) {
        console.error('paymentPagbankWebhook', 'NotFound', body);
        throw new Error('Not able to find payment');
    }

    // TODO: Handle the body response
    console.log('paymentPagbankWebhook', 'body', body);
    console.log('paymentPagbankWebhook', 'payment', payment);

    return body;
};
