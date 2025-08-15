import { supabaseClient } from '@/providers/supabase';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { TDbClientFilters } from '../types/clients';
import { TPagination } from '../types/pagination';
import { PaginationDto } from '../dtos/pagination';

const createDbFilters = (
    query: PostgrestFilterBuilder<any, any, any>,
    filters: TDbClientFilters
) => {
    for (const [key, value] of Object.entries(filters)) {
        const filter = Array.isArray(value) ? value : [value];
        if (key === '$or') {
            const or = filter.map(f => {
                const { op, field, value } = f;
                return [field, op, value].join('.');
            });
            query.or(or.join(','));
            continue;
        }
        for (const f of filter) {
            const { op, value } = f;
            if (op.startsWith('.not')) {
                query.not(key, op.slice(4), value);
            } else {
                query[op](key, value);
            }
        }
    }
    return query;
};

const createDbClient = (table: string) => ({
    create: async <T = any>(values: Partial<T>): Promise<T> => {
        const { data, error } = await supabaseClient
            .from(table)
            .insert(values)
            .select('*')
            .single();
        if (error) {
            console.error('db.create', error);
            throw error;
        }
        return data as T;
    },

    deleteHard: async (id: string): Promise<void> => {
        const { error } = await supabaseClient
            .from(table)
            .delete()
            .eq('id', id);
        if (error) {
            console.error('db.deleteHard', error);
            throw error;
        }
    },

    deleteSoft: async (
        id: string,
        field: string = 'deleted_at',
        value: boolean | Date = new Date()
    ): Promise<void> => {
        const { error } = await supabaseClient
            .from(table)
            .update({ [field]: value })
            .eq('id', id);
        if (error) {
            console.error('db.delete', error);
            throw error;
        }
    },

    select: async <T = any>(
        filters: TDbClientFilters,
        pagination: TPagination
    ): Promise<{ count: number; data: T[] }> => {
        const { limit, order, orderDir, page } =
            PaginationDto.parse(pagination);

        let query = supabaseClient.from(table).select('*', { count: 'exact' });
        query = createDbFilters(query, filters);

        if (limit !== undefined) {
            const offset = (page - 1) * limit;
            query.range(offset, offset + limit - 1);
        }
        if (order !== undefined) {
            query.order(order, { ascending: orderDir === 'asc' });
        }

        const { count, data, error } = await query;
        if (error) {
            console.error('db.select', error);
            throw error;
        }
        return { count, data: data as T[] };
    },

    selectAll: async <T = any>(
        filters: TDbClientFilters = {}
    ): Promise<T[]> => {
        let query = supabaseClient.from(table).select('*');
        query = createDbFilters(query, filters);

        const { data, error } = await query;
        if (error) {
            console.error('db.select', error);
            throw error;
        }
        return data as T[];
    },

    single: async <T = any>(
        filters: TDbClientFilters = {}
    ): Promise<T | null> => {
        let query = supabaseClient.from(table).select('*');
        query = createDbFilters(query, filters);

        const { data, error } = await query.maybeSingle();
        if (error) {
            console.error('db.single', error);
            throw error;
        }
        return !data ? null : (data as T);
    },

    update: async <T = any>(id: string, values: Partial<T>): Promise<T> => {
        const { data, error } = await supabaseClient
            .from(table)
            .update(values)
            .eq('id', id)
            .select('*')
            .single();
        if (error) {
            console.error('db.update', error);
            throw error;
        }
        return data as T;
    },
});

export { createDbClient };
