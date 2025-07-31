import { eventBus } from "@/libs/event-bus-client";

import { TProductPriceFindQueryDTO } from "./product-price.controller.dto";
import { TProductPriceEvents } from "./product-price.events";
import { productPriceRepository } from "./product-price.repository";
import { type TProductPrice } from "./product-price.schema";

export const productPriceService = {
    create: async (data: Omit<Partial<TProductPrice>, 'id'>): Promise<TProductPrice> => {
        const result = await productPriceRepository.create(data);
        eventBus.emit<TProductPriceEvents['product-price.created']>('product-price.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { productId } = await productPriceRepository.getById(id);
        await productPriceRepository.deleteById(id);
        eventBus.emit<TProductPriceEvents['product-price.deleted']>('product-price.deleted', { id, productId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TProductPriceFindQueryDTO
    ): Promise<{ data: TProductPrice[], total: number }> => {
        return productPriceRepository.find(limit, page, query);
    },

    findByProductId: async (
        productId: string,
        limit?: number,
        page?: number,
        query?: Omit<TProductPriceFindQueryDTO, 'productId'>
    ): Promise<{ data: TProductPrice[], total: number }> => {
        return productPriceRepository.find(limit, page, { productId, ...query });
    },

    getById: async (id: string): Promise<TProductPrice> => {
        return productPriceRepository.getById(id);
    },

    getByProductIdAndVehicleType: async (productId: string, vehicleType: string): Promise<TProductPrice> => {
        return productPriceRepository.getByProductIdAndVehicleType(productId, vehicleType);
    },

    updateById: async (id: string, data: Partial<TProductPrice>): Promise<TProductPrice> => {
        const prev = await productPriceRepository.getById(id);
        const result = await productPriceRepository.updateById(id, data);
        eventBus.emit<TProductPriceEvents['product-price.updated']>('product-price.updated', { prev, next: result });
        return result;
    }
};
