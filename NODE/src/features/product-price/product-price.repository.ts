import { and, count, eq, isNull, gte, lte } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TProductPrice, productPrices } from "./product-price.schema";
import { TProductPriceFindQueryDTO } from "./product-price.controller.dto";
import { TVehicleType } from "../vehicle";

export const productPriceRepository = {
    create: async (data: Omit<Partial<TProductPrice>, 'id'>): Promise<TProductPrice> => {
        const productPrice = {...data } as TProductPrice;

        // Check if the product price is already created for the same product and vehicle type
        try {
            const { productId, vehicleType } = productPrice;
            await productPriceRepository.getByProductIdAndVehicleType(productId, vehicleType);
            throwRecordDuplicated('Product price already exists for this product and vehicle type');
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('productPriceRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(productPrices).values(productPrice).returning();
            if (result.length === 0) {
                throw new Error('Product price not created');
            }
            return result[0] as TProductPrice;
        } catch (err) {
            console.error('productPriceRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await productPriceRepository.getById(id);
            await db.update(productPrices)
                .set({ deletedAt: new Date() })
                .where(eq(productPrices.id, id));
        } catch (err) {
            console.error('productPriceRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TProductPriceFindQueryDTO,
    ): Promise<{ data: TProductPrice[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(productPrices.deletedAt)
            ];

            if (query?.productId) {
                where.push(eq(productPrices.productId, query.productId));
            }
            if (query?.vehicleType) {
                where.push(eq(productPrices.vehicleType, query.vehicleType));
            }
            if (query?.price !== undefined) {
                where.push(eq(productPrices.price, query.price));
            }
            if (query?.washerQuota !== undefined) {
                where.push(eq(productPrices.washerQuota, query.washerQuota));
            }
            if (query?.traineeQuota !== undefined) {
                where.push(eq(productPrices.traineeQuota, query.traineeQuota));
            }
            if (query?.duration !== undefined) {
                where.push(eq(productPrices.duration, query.duration));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(productPrices)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(productPrices)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TProductPrice[],
                total: Number(total)
            };
        } catch (err) {
            console.error('productPriceRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TProductPrice> => {
        try {
            const result = await db
                .select()
                .from(productPrices)
                .where(and(
                    eq(productPrices.id, id),
                    isNull(productPrices.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Product price not found');
            }
            return result[0] as TProductPrice;
        } catch (err) {
            console.error('productPriceRepository.getById', err);
            throw err;
        }
    },

    getByProductIdAndVehicleType: async (
        productId: string,
        vehicleType: TVehicleType
    ): Promise<TProductPrice> => {
        try {
            const result = await db
                .select()
                .from(productPrices)
                .where(and(
                    eq(productPrices.productId, productId),
                    eq(productPrices.vehicleType, vehicleType),
                    isNull(productPrices.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Product price not found');
            }
            return result[0] as TProductPrice;
        } catch (err) {
            console.error('productPriceRepository.getByProductIdAndVehicleType', err);
            throw err;
        }
    },

    updateById: async (id: string, productPrice: Partial<TProductPrice>): Promise<TProductPrice> => {
        try {
            const current = await productPriceRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TProductPrice> = Object.fromEntries(
                Object.entries(productPrice).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return productPriceRepository.getById(id);
            }

            if (updateData.vehicleType && updateData.vehicleType !== current.vehicleType) {
                try {
                    await productPriceRepository.getByProductIdAndVehicleType(current.productId, updateData.vehicleType);
                    throwRecordDuplicated('Product price already exists for this product and vehicle type');
                } catch (err) {
                    if (!(err instanceof RecordNotFoundError)) {
                        console.error('productPriceRepository.updateById', err);
                        throw err;
                    }
                }
            }

            const result = await db.update(productPrices)
                .set(updateData)
                .where(eq(productPrices.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Product price not found');
            }
            return result[0] as TProductPrice;
        } catch (err) {
            console.error('productPriceRepository.updateById', err);
            throw err;
        }
    }
};
