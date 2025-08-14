import * as t from './types';

export interface IProvider {
    /**
     * Authorize a payment
     */
    authorize(
        payment: t.TPaymentDto,
        options?: t.TProviderOptions
    ): Promise<t.TProviderResponseDto>;

    /**
     * Cancel a payment
     */
    cancel(
        payment: t.TPaymentDto,
        options?: t.TProviderOptions
    ): Promise<t.TProviderResponseDto>;

    /**
     * Capture a payment
     */
    capture(
        payment: t.TPaymentDto,
        options?: t.TProviderOptions
    ): Promise<t.TProviderResponseDto>;

    /**
     * Create a new payment
     */
    create(
        payment: t.TPaymentDto,
        user?: t.TUserDto,
        options?: t.TProviderOptions
    ): Promise<t.TProviderResponseDto>;

    /**
     * Get provider name
     */
    getName(): Promise<string>;

    /**
     * Get payment details
     */
    getPaymentById(
        payment: t.TPaymentDto,
        options?: t.TProviderOptions
    ): Promise<t.TProviderResponseDto>;
}
