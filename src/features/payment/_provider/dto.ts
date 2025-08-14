import { z } from 'zod';
import { PAYMENT_ENUMS } from '../enums';

export const ProviderResponseDto = z.object({
    id: z.string(),
    status: z.enum(PAYMENT_ENUMS.STATUS).optional(),
    link: z.string().optional(),
    meta: z.any().optional(),
});
