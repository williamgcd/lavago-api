import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a offering record
     * @param values - The offering values to create
     * @returns The created offering record
     */
    create: async (values: t.TOfferingDtoCreate) => {
        const created = await repo.create(values);
        emitter('offering.created', { id: created.id });
        return created;
    },

    /**
     * Delete a offering record
     * @param id - The id of the offering record to delete
     * @returns void
     */
    delete: async (id: t.TOfferingDto['id']) => {
        const current = await repo.getById(id);
        emitter('offering.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a offering record by id
     * @param id - The id of the offering record to get
     * @returns The offering record
     */
    getById: async (id: t.TOfferingDto['id']) => {
        return repo.getById(id);
    },

    /**
     * Get a offering record by num
     * @param num - The num of the offering record to get
     * @returns The offering record
     */
    getByNum: async (num: t.TOfferingDto['num']) => {
        return repo.getByNum(num);
    },

    /**
     * Get a offering record by sku
     * @param sku - The sku of the offering record to get
     * @returns The offering record
     */
    getBySku: async (sku: t.TOfferingDto['sku']) => {
        return repo.getBySku(sku);
    },

    /**
     * List offering records
     * @param filters - The filters to apply to the offering records
     * @param pagination - The pagination to apply to the offering records
     * @returns The offering records
     */
    list: async (
        filters: t.TOfferingDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TOfferingDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * Update a offering record
     * @param id - The id of the offering record to update
     * @param values - The offering values to update
     * @returns The updated offering record
     */
    update: async (id: t.TOfferingDto['id'], values: t.TOfferingDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('offering.updated', {
            id: current.id,
            current,
            updated,
        });
        return updated;
    },
};

export { serv, serv as offeringService };
export default serv;
