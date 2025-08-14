import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a rating record
     * @param values - The rating values to create
     * @returns The created rating record
     */
    create: async (values: t.TRatingDtoCreate) => {
        const created = await repo.create(values);
        emitter('rating.created', { id: created.id });
        return created;
    },

    /**
     * Delete a rating record
     * @param id - The id of the rating record to delete
     * @returns void
     */
    delete: async (id: t.TRatingDto['id']) => {
        const current = await repo.getById(id);
        emitter('rating.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a rating record by id
     * @param id - The id of the rating record to get
     * @returns The rating record
     */
    getById: async (id: t.TRatingDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List rating records
     * @param filters - The filters to apply to the rating records
     * @param pagination - The pagination to apply to the rating records
     * @returns The rating records
     */
    list: async (
        filters: t.TRatingDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TRatingDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List rating records by user id
     * @param user_id - The user id to filter by
     * @param filters - The filters to apply to the rating records
     * @param pagination - The pagination to apply to the rating records
     * @returns The rating records
     */
    listByUserId: async (
        user_id: t.TRatingDtoFilter['user_id'],
        filters: t.TRatingDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TRatingDto[] }> => {
        filters.user_id = user_id;
        return repo.list(filters, pagination);
    },

    /**
     * List rating records by entity id
     * @param entity - The entity type to filter by
     * @param entity_id - The entity id to filter by
     * @param filters - The filters to apply to the rating records
     * @param pagination - The pagination to apply to the rating records
     * @returns The rating records
     */
    listByEntityId: async (
        entity: t.TRatingDtoFilter['entity'],
        entity_id: t.TRatingDtoFilter['entity_id'],
        filters: t.TRatingDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TRatingDto[] }> => {
        filters.entity = entity;
        filters.entity_id = entity_id;
        return repo.list(filters, pagination);
    },

    /**
     * Update a rating record
     * @param id - The id of the rating record to update
     * @param values - The rating values to update
     * @returns The updated rating record
     */
    update: async (id: t.TRatingDto['id'], values: t.TRatingDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('rating.updated', {
            id: current.id,
            current,
            updated,
        });
        return updated;
    },
};

export { serv, serv as ratingService };
export default serv;
