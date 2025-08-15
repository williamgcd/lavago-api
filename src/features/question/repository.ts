import { ZodObject } from 'zod';

import { throwRecordMissing } from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('questions');

const repo = {
    /**
     * Creates a new question record
     * @params values - the question values to create
     * @returns the created question record
     */
    create: async (
        values: Partial<t.TQuestionDto>
    ): Promise<t.TQuestionDto> => {
        const data = { ...values } as Partial<t.TQuestionDto>;
        await repo.parse(data, d.QuestionDtoCreate);

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.QuestionDto.parse(created);
        } catch (err) {
            console.error('question.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a question record
     * @param id - The id of the question record to delete
     * @param existing - The existing question record
     * @returns void
     */
    delete: async (
        id: t.TQuestionDto['id'],
        existing?: t.TQuestionDto,
        hard: boolean = false
    ): Promise<void> => {
        try {
            let record = existing;
            if (!existing) {
                record = await repo.getById(id);
            }
            // Delete record from the database;
            if (hard === true) {
                await db.deleteHard(record.id);
                return;
            }
            await db.deleteSoft(record.id);
        } catch (err) {
            console.error('question.repo.delete', err);
            throw err;
        }
    },

    /**
     * Filter question records
     * @param filters - The filters to apply to the question records
     * @returns The filtered question records
     */
    filter: async (filters: t.TQuestionDtoFilter) => {
        const where: any = {};

        if (filters.entity) {
            const value = filters.entity;
            where.entity = { op: 'eq', value };
        }
        if (filters.metric) {
            const value = filters.metric;
            where.metric = { op: 'eq', value };
        }
        if (filters.pattern) {
            const value = filters.pattern;
            where.pattern = { op: 'eq', value };
        }

        return where;
    },

    /**
     * Get a question record by id
     * @param id - The id of the question record to get
     * @returns The question record
     */
    getById: async (value: t.TQuestionDto['id']): Promise<t.TQuestionDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Question');
            }
            return d.QuestionDto.parse(data);
        } catch (err) {
            console.error('question.repo.getById', err);
            throw err;
        }
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
        const where = await repo.filter(filters);
        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.QuestionDto.parse(r)) };
        } catch (err) {
            console.error('question.repo.list', err);
            throw err;
        }
    },

    /**
     * Parse a question record
     * @param data - The data to parse
     * @param schema - The schema to parse the data with
     * @returns The parsed question record
     */
    parse: async (data: Partial<t.TQuestionDto>, schema: ZodObject<any>) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('question.repo.parse', err);
            throw err;
        }
    },

    /**
     * Update a question record
     * @param id - The id of the question record to update
     * @param values - The question values to update
     * @param existing - The existing question record
     * @returns The updated question record
     */
    update: async (
        id: t.TQuestionDto['id'],
        values: Partial<t.TQuestionDto>,
        existing?: t.TQuestionDto
    ): Promise<t.TQuestionDto> => {
        const data = { ...values } as Partial<t.TQuestionDto>;
        await repo.parse(values, d.QuestionDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        delete data.id;
        delete data.entity;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(id, data);
            return d.QuestionDto.parse(updated);
        } catch (err) {
            console.error('question.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as questionRepository };
export default repo;
