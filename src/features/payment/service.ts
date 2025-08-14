import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import { providerService } from './_provider/service';

import * as t from './types';
import { repo } from './repository';
import { TProviderResponseDto } from './_provider/types';

const serv = {
    /**
     * Create a payment record with event emission
     * @param values - The payment values to create
     * @returns The created payment record
     * @throws Error if validation fails
     */
    create: async (values: t.TPaymentDtoCreate) => {
        const created = await repo.create(values);

        // Create the payment on the provider
        const result = await providerService.create(created);

        const update: t.TPaymentDtoUpdate = {
            status: result.status || 'waiting',
            provider_id: result.id,
            provider_link: result.link,
            provider_meta: result.meta,
        };
        // Update the payment with provider data
        const updated = await repo.update(created.id, update);

        emitter('payment.created', { id: created.id });
        return updated;
    },

    /**
     * Delete a payment record with event emission
     * @param id - The ID of the payment record to delete
     * @returns Promise that resolves to void
     * @throws Error if payment not found
     */
    delete: async (id: t.TPaymentDto['id']) => {
        const current = await repo.getById(id);
        // TODO: Check if the payment is completed
        // TODO: Reach the provider for cancelation
        emitter('payment.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a payment record by ID
     * @param id - The ID of the payment record to get
     * @returns The payment record
     * @throws Error if payment not found
     */
    getById: async (id: t.TPaymentDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List payment records with filtering and pagination
     * @param filters - The filters to apply to the payment records
     * @param pagination - The pagination parameters (optional)
     * @returns Object containing count and data array of payment records
     * @throws Error if database query fails
     */
    list: async (
        filters: t.TPaymentDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPaymentDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List payment records by entity
     * @param entity - The entity to filter by
     * @param filters - The filters to apply to the payment records
     * @param pagination - The pagination to apply to the payment records
     * @returns The payment records
     */
    listByEntity: async (
        entity: t.TPaymentDtoFilter['entity'],
        filters: t.TPaymentDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPaymentDto[] }> => {
        filters.entity = entity;
        return repo.list(filters, pagination);
    },

    /**
     * List payment records by entity id
     * @param entity - The entity to filter by
     * @param entity_id - The entity id to filter by
     * @param filters - The filters to apply to the payment records
     * @param pagination - The pagination to apply to the payment records
     * @returns The payment records
     */
    listByEntityId: async (
        entity: t.TPaymentDtoFilter['entity'],
        entity_id: t.TPaymentDtoFilter['entity_id'],
        filters: t.TPaymentDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPaymentDto[] }> => {
        filters.entity = entity;
        filters.entity_id = entity_id;
        return repo.list(filters, pagination);
    },

    /**
     * List payment records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the payment records
     * @param pagination - The pagination to apply to the payment records
     * @returns The payment records
     */
    listByUserId: async (
        user_id: t.TPaymentDtoFilter['user_id'],
        filters: t.TPaymentDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TPaymentDto[] }> => {
        filters.user_id = user_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a payment record with event emission
     * @param id - The ID of the payment record to update
     * @param values - The payment values to update
     * @returns The updated payment record
     * @throws Error if payment not found or validation fails
     */
    update: async (id: t.TPaymentDto['id'], values: t.TPaymentDtoUpdate) => {
        const current = await repo.getById(id);
        if (values.status !== current.status) {
            throw new Error('Cannot change status, use logic functions');
        }
        // TODO: Do I need to update something on the provider?
        const updated = await repo.update(id, values, current);
        emitter('payment.updated', { id: current.id, current, updated });
        return updated;
    },

    updateProvider: async (
        payment: t.TPaymentDto,
        providerResponse: TProviderResponseDto
    ) => {
        const { id, status, link, meta } = providerResponse;
        const update: t.TPaymentDtoUpdate = {
            status: status ? status : payment.status,
            provider_id: id ? id : payment.provider_id,
            provider_link: link ? link : payment.provider_link,
            provider_meta: {
                ...payment.provider_meta,
                ...(meta || {}),
            },
        };
        // Update the payment with provider data
        return await repo.update(payment.id, update);
    },

    /* ************************** */
    /* Bussiness Logic functions
    /* ************************** */

    authorize: async (id: t.TPaymentDto['id']) => {
        const record = await serv.getById(id);
        // Authorize the payment on the provider
        const response = await providerService.authorize(record);
        const updated = await serv.updateProvider(record, response);
        emitter('payment.status.authorized', { id: record.id });
        return updated;
    },

    cancel: async (id: t.TPaymentDto['id']) => {
        const record = await serv.getById(id);
        // Cancel the payment on the provider
        const response = await providerService.cancel(record);
        const updated = await serv.updateProvider(record, response);
        emitter('payment.status.cancelled', { id: record.id });
        return updated;
    },

    capture: async (id: t.TPaymentDto['id']) => {
        const record = await serv.getById(id);
        // Capture the payment on the provider
        const response = await providerService.capture(record);
        const updated = await serv.updateProvider(record, response);
        emitter('payment.status.captured', { id: record.id });
        return updated;
    },
};

export { serv, serv as paymentService };
export default serv;
