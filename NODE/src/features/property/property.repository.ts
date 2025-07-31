import { and, count, eq, isNull, like } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TProperty, properties } from "./property.schema";
import { TPropertyFindQueryDTO } from "./property.controller.dto";

export const propertyRepository = {
    create: async (data: Omit<Partial<TProperty>, 'id'>): Promise<TProperty> => {
        const property = {...data } as TProperty;

        try {
            const { name, zip } = property;
            const { data: properties } = await propertyRepository.find(PAGINATION.DEFAULT_LIMIT_MAX, 1, { zip });
            if (properties.find(p => p.name === name)) {
                throwRecordDuplicated('Property already exists with same name and zipcode');
            }
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('propertyRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(properties).values(property).returning();
            if (result.length === 0) {
                throw new Error('Property not created');
            }
            return result[0] as TProperty;
        } catch (err) {
            console.error('propertyRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await propertyRepository.getById(id);
            await db.update(properties)
                .set({ deletedAt: new Date() })
                .where(eq(properties.id, id));
        } catch (err) {
            console.error('propertyRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TPropertyFindQueryDTO,
    ): Promise<{ data: TProperty[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(properties.deletedAt)
            ];

            if (query?.name) {
                where.push(like(properties.name, `%${query.name}%`));
            }
            if (query?.country) {
                where.push(eq(properties.country, query.country));
            }
            if (query?.country && query?.state) {
                where.push(like(properties.state, `%${query.state}%`));
            }
            if (query?.country && query?.state && query?.city) {
                where.push(like(properties.city, `%${query.city}%`));
            }
            if (query?.zip) {
                where.push(like(properties.zip, `%${query.zip}%`));
            }
            if (query?.isSupported !== undefined) {
                where.push(eq(properties.isSupported, query.isSupported!));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(properties)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(properties)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TProperty[],
                total: Number(total)
            };
        } catch (err) {
            console.error('propertyRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TProperty> => {
        try {
            const result = await db
                .select()
                .from(properties)
                .where(and(
                    eq(properties.id, id),
                    isNull(properties.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Property not found');
            }
            return result[0] as TProperty;
        } catch (err) {
            console.error('propertyRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, property: Partial<TProperty>): Promise<TProperty> => {
        try {
            // Build updateData object only with defined values;
            const updateData: Partial<TProperty> = Object.fromEntries(
                Object.entries(property).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return propertyRepository.getById(id);
            }

            // Check if the property is already created for with same name and zipcode
            try {
                const { name, zip } = updateData;
                const { data: properties } = await propertyRepository.find(PAGINATION.DEFAULT_LIMIT_MAX, 1, { zip });
                if (properties.find(p => p.name === name)) {
                    throwRecordDuplicated('Property already exists with same name and zipcode');
                }
            } catch (err) {
                if (!(err instanceof RecordNotFoundError)) {
                    console.error('propertyRepository.updateById', err);
                    throw err;
                }
            }

            const result = await db.update(properties)
                .set(updateData)
                .where(eq(properties.id, id))
                .returning();

            if (result.length === 0) {
                throwRecordNotFound('Property not found');
            }
            return result[0] as TProperty;
        } catch (err) {
            console.error('propertyRepository.updateById', err);
            throw err;
        }
    }
};
