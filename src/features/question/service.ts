import { emitter } from '@/shared/helpers/event-bus';
import { TPagination } from '@/shared/types/pagination';

import * as t from './types';
import { repo } from './repository';

const serv = {
    /**
     * Create a question record
     * @param values - The question values to create
     * @returns The created question record
     */
    create: async (values: t.TQuestionDtoCreate) => {
        const created = await repo.create(values);
        emitter('question.created', { id: created.id });
        return created;
    },

    /**
     * Delete a question record
     * @param id - The id of the question record to delete
     * @returns void
     */
    delete: async (id: t.TQuestionDto['id']) => {
        const current = await repo.getById(id);
        emitter('question.deleted', { id: current.id });
        return repo.delete(id, current);
    },

    /**
     * Get a question record by id
     * @param id - The id of the question record to get
     * @returns The question record
     */
    getById: async (id: t.TQuestionDto['id']) => {
        return repo.getById(id);
    },

    /**
     * List question records
     * @param filters - The filters to apply to the question records
     * @param pagination - The pagination to apply to the question records
     * @returns The question records
     */
    list: async (
        filters: t.TQuestionDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TQuestionDto[] }> => {
        return repo.list(filters, pagination);
    },

    /**
     * List question records by entity
     * @param entity - The entity type to filter by
     * @param filters - The filters to apply to the question records
     * @param pagination - The pagination to apply to the question records
     * @returns The question records
     */
    listByEntity: async (
        entity: t.TQuestionDtoFilter['entity'],
        filters: t.TQuestionDtoFilter = {},
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TQuestionDto[] }> => {
        filters.entity = entity;
        return repo.list(filters, pagination);
    },

    /**
     * Update a question record
     * @param id - The id of the question record to update
     * @param values - The question values to update
     * @returns The updated question record
     */
    update: async (id: t.TQuestionDto['id'], values: t.TQuestionDtoUpdate) => {
        const current = await repo.getById(id);
        const updated = await repo.update(id, values, current);
        emitter('question.updated', { id: current.id, current, updated });
        return updated;
    },
};

export { serv, serv as questionService };
export default serv;
