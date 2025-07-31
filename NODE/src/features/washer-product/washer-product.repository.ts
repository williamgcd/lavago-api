import { and, count, eq, isNull } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TWasherProduct, washerProducts } from "./washer-product.schema";
import { TWasherProductFindQueryDTO } from "./washer-product.controller.dto";

export const washerProductRepository = {
    create: async (data: Omit<Partial<TWasherProduct>, 'id'>): Promise<TWasherProduct> => {
        const washerProduct = {...data } as TWasherProduct;

        // TODO: Check if the washer product is already created for the same user and product
        try {
            const { userId, productId } = washerProduct;
            await washerProductRepository.getByUserIdAndProductId(userId, productId);
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('washerProductRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(washerProducts).values(washerProduct).returning();
            if (result.length === 0) {
                throw new Error('Washer product not created');
            }
            return result[0] as TWasherProduct;
        } catch (err) {
            console.error('washerProductRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await washerProductRepository.getById(id);
            await db.update(washerProducts)
                .set({ deletedAt: new Date() })
                .where(eq(washerProducts.id, id));
        } catch (err) {
            console.error('washerProductRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TWasherProductFindQueryDTO,
    ): Promise<{ data: TWasherProduct[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(washerProducts.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(washerProducts.userId, query.userId));
            }
            if (query?.productId) {
                where.push(eq(washerProducts.productId, query.productId));
            }
            if (query?.isPreferred !== undefined) {
                where.push(eq(washerProducts.isPreferred, query.isPreferred));
            }
            if (query?.trainedBy) {
                where.push(eq(washerProducts.trainedBy, query.trainedBy));
            }
            if (query?.licensedBy) {
                where.push(eq(washerProducts.licensedBy, query.licensedBy));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(washerProducts)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(washerProducts)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TWasherProduct[],
                total: Number(total)
            };
        } catch (err) {
            console.error('washerProductRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TWasherProduct> => {
        try {
            const result = await db
                .select()
                .from(washerProducts)
                .where(and(
                    eq(washerProducts.id, id),
                    isNull(washerProducts.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Washer product not found');
            }
            return result[0] as TWasherProduct;
        } catch (err) {
            console.error('washerProductRepository.getById', err);
            throw err;
        }
    },

    getByUserIdAndProductId: async (userId: string, productId: string): Promise<TWasherProduct> => {
        try {
            const result = await db
                .select()
                .from(washerProducts)
                .where(and(
                    eq(washerProducts.userId, userId),
                    eq(washerProducts.productId, productId),
                    isNull(washerProducts.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Washer product not found');
            }
            return result[0] as TWasherProduct;
        } catch (err) {
            console.error('washerProductRepository.getByUserIdAndProductId', err);
            throw err;
        }
    },

    updateById: async (id: string, washerProduct: Partial<TWasherProduct>): Promise<TWasherProduct> => {
        try {
            const current = await washerProductRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TWasherProduct> = Object.fromEntries(
                Object.entries(washerProduct).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return washerProductRepository.getById(id);
            }

            const result = await db.update(washerProducts)
                .set(updateData)
                .where(eq(washerProducts.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Washer product not found');
            }
            return result[0] as TWasherProduct;
        } catch (err) {
            console.error('washerProductRepository.updateById', err);
            throw err;
        }
    }
}; 