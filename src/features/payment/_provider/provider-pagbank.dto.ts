import { CONFIG } from '@/config';
import { TPaymentDto } from '@/features/payment/types';
import { TUserDto } from '@/features/user/types';
import { generator } from '@/shared/utils/generator';

import { normalizer } from '@/shared/utils/normalizer';

export const PagBankCheckoutDto = (payment: TPaymentDto, user: TUserDto) =>
    ({
        reference_id: payment.id,
        expiration_date: generator.expDate(90).toISOString(),
        customer: {
            name: user.name,
            email: user.email,
            phone: normalizer.phoneToObj(user.phone),
            tax_id: user.document,
        },
        customer_modifiable: true,
        items: [],
        additional_amount: 0,
        discount_amount: 0,
        soft_descriptor: 'LAVAGO Lavagens Automotivas',
        notification_urls: [
            `${CONFIG.APP_BASE}/webhook/v1/payment/pagbank/${payment.id}`,
        ],
        payment_notification_urls: [
            `${CONFIG.APP_BASE}/webhook/v1/payment/pagbank/${payment.id}`,
        ],
    }) as any; // Partial<PagBankOrderRequest>;
