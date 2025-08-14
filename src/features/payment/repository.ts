import { ZodObject } from 'zod';

import {
    throwRecordDeleted,
    throwRecordExists,
    throwRecordInactive,
    throwRecordMissing,
} from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('payments');

const repo = {
    /**
     * Parse and validate data against a Zod schema
     * @param data - The data to validate
     * @param schema - The Zod schema to validate against
     * @returns The parsed and validated data
     * @throws Error if validation fails
     */
    parse: async (data: Partial<t.TPaymentDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('payment.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new payment record
     * @param values - The payment values to create
     * @returns The created payment record
     * @throws Error if validation fails
     */
    create: async (values: Partial<t.TPaymentDto>): Promise<t.TPaymentDto> => {
        const data = { ...values } as Partial<t.TPaymentDto>;
        await repo.parse(data, d.PaymentDtoCreate);

        try {
            // Add record to the database
            const created = await db.create(data);
            return d.PaymentDto.parse(created);
        } catch (err) {
            console.error('payment.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a payment record (soft delete by default)
     * @param id - The ID of the payment record to delete
     * @param existing - The existing payment record (optional, will fetch if not provided)
     * @param hard - Whether to perform hard delete (default: false)
     * @returns Promise that resolves to void
     * @throws Error if payment not found
     */
    delete: async (
        id: t.TPaymentDto['id'],
        existing?: t.TPaymentDto,
        hard: boolean = false
    ): Promise<void> => {
        try {
            let record = existing;
            if (!existing) {
                record = await repo.getById(id);
            }
            // Delete record from the database
            if (hard === true) {
                await db.deleteHard(record.id);
                return;
            }
            await db.deleteSoft(record.id);
        } catch (err) {
            console.error('payment.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a payment record by ID
     * @param value - The ID of the payment record to get
     * @returns The payment record
     * @throws Error if payment not found or inactive
     */
    getById: async (value: t.TPaymentDto['id']): Promise<t.TPaymentDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Payment');
            }
            return d.PaymentDto.parse(data);
        } catch (err) {
            console.error('payment.repo.getById', err);
            throw err;
        }
    },

    /**
     * Get payment record by provider ID
     * @param providerId - The provider ID to get payment
     * @returns The payment record
     * @throws Error if payment not found
     */
    getByProviderId: async (providerId: string): Promise<t.TPaymentDto> => {
        try {
            const data = await db.single({
                provider_id: { op: 'eq', value: providerId },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Payment');
            }
            return d.PaymentDto.parse(data);
        } catch (err) {
            console.error('payment.repo.getByProviderId', err);
            throw err;
        }
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
        const where: any = {
            deleted_at: { op: 'is', value: null },
        };

        if (filters.user_id) {
            const value = filters.user_id;
            where.user_id = { op: 'eq', value };
        }
        if (filters.entity) {
            const value = filters.entity;
            where.entity = { op: 'eq', value };
        }
        if (filters.entity && filters.entity_id) {
            const value = filters.entity_id;
            where.entity_id = { op: 'eq', value };
        }

        if (filters.status) {
            const value = filters.status;
            where.status = { op: 'eq', value };
        }
        if (filters.type) {
            const value = filters.type;
            where.type = { op: 'eq', value };
        }
        if (filters.method) {
            const value = filters.method;
            where.method = { op: 'eq', value };
        }

        if (filters.provider) {
            const value = filters.provider;
            where.provider = { op: 'eq', value };
        }

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.PaymentDto.parse(r)) };
        } catch (err) {
            console.error('payment.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a payment record
     * @param id - The ID of the payment record to update
     * @param values - The payment values to update
     * @param existing - The existing payment record (optional, will fetch if not provided)
     * @returns The updated payment record
     * @throws Error if payment not found or validation fails
     */
    update: async (
        id: t.TPaymentDto['id'],
        values: Partial<t.TPaymentDto>,
        existing?: t.TPaymentDto
    ): Promise<t.TPaymentDto> => {
        const data = { ...values } as Partial<t.TPaymentDto>;
        await repo.parse(values, d.PaymentDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database
            const updated = await db.update(record.id, data);
            return d.PaymentDto.parse(updated);
        } catch (err) {
            console.error('payment.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as paymentRepository };
export default repo;
