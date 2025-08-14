import z from 'zod';
import * as d from './dto';

export { TUserDto } from '../../user/types';
export * from '../types';

export type TProviderOptions = {
    [key: string]: any;
};

export type TProviderAuthorizeReq = {
    payment_id: string;
    idempotency_key?: string;
};
export type TProviderCancelReq = {
    payment_id: string;
    idempotency_key?: string;
};
export type TProviderCaptureReq = {
    payment_id: string;
    idempotency_key?: string;
};

export type TProviderResponseDto = z.infer<typeof d.ProviderResponseDto>;
