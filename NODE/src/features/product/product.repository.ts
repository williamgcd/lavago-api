import { and, count, eq, isNull, like } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TProduct, products } from "./product.schema";
import { TProductFindQueryDTO } from "./product.controller.dto";

export const productRepository = {
    create: async (data: Omit<Partial<TProduct>, 'id'>): Promise<TProduct> => {
        const product = {...data } as TProduct;

        // Check if the product is already created with same name and mode
        try {
            const { name, mode } = product;
            const { data: existingProducts } = await productRepository.find(PAGINATION.DEFAULT_LIMIT_MAX, 1, { name, mode });
            if (existingProducts.find(p => p.name === name && p.mode === mode)) {
                throwRecordDuplicated('Product already exists with same name and mode');
            }
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('productRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(products).values(product).returning();
            if (result.length === 0) {
                throw new Error('Product not created');
            }
            return result[0] as TProduct;
        } catch (err) {
            console.error('productRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await productRepository.getById(id);
            await db.update(products)
                .set({ deletedAt: new Date() })
                .where(eq(products.id, id));
        } catch (err) {
            console.error('productRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TProductFindQueryDTO,
    ): Promise<{ data: TProduct[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(products.deletedAt)
            ];

            if (query?.name) {
                where.push(like(products.name, `%${query.name}%`));
            }
            if (query?.mode) {
                where.push(eq(products.mode, query.mode));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(products)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(products)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TProduct[],
                total: Number(total)
            };
        } catch (err) {
            console.error('productRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TProduct> => {
        try {
            const result = await db
                .select()
                .from(products)
                .where(and(
                    eq(products.id, id),
                    isNull(products.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Product not found');
            }
            return result[0] as TProduct;
        } catch (err) {
            console.error('productRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, product: Partial<TProduct>): Promise<TProduct> => {
        try {
            const current = await productRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TProduct> = Object.fromEntries(
                Object.entries(product).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return productRepository.getById(id);
            }

            // Check if the product is already created with same name and mode
            if (updateData.name || updateData.mode) {
                try {
                    const name = updateData.name || current.name;
                    const mode = updateData.mode || current.mode;
                    const { data: existingProducts } = await productRepository.find(PAGINATION.DEFAULT_LIMIT_MAX, 1, { name, mode });
                    if (existingProducts.find(p => p.name === name && p.mode === mode && p.id !== id)) {
                        throwRecordDuplicated('Product already exists with same name and mode');
                    }
                } catch (err) {
                    if (!(err instanceof RecordNotFoundError)) {
                        console.error('productRepository.updateById', err);
                        throw err;
                    }
                }
            }

            const result = await db.update(products)
                .set(updateData)
                .where(eq(products.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Product not found');
            }
            return result[0] as TProduct;
        } catch (err) {
            console.error('productRepository.updateById', err);
            throw err;
        }
    }
};
