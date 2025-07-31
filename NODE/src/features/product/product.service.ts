import { eventBus } from "@/libs/event-bus-client";

import { TProductFindQueryDTO } from "./product.controller.dto";
import { TProductEvents } from "./product.events";
import { productRepository } from "./product.repository";
import { type TProduct } from "./product.schema";

export const productService = {
    create: async (data: Omit<Partial<TProduct>, 'id'>): Promise<TProduct> => {
        const result = await productRepository.create(data);
        eventBus.emit<TProductEvents['product.created']>('product.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        await productRepository.getById(id);
        await productRepository.deleteById(id);
        eventBus.emit<TProductEvents['product.deleted']>('product.deleted', { id });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TProductFindQueryDTO
    ): Promise<{ data: TProduct[], total: number }> => {
        return productRepository.find(limit, page, query);
    },

    getById: async (id: string): Promise<TProduct> => {
        return productRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TProduct>): Promise<TProduct> => {
        const prev = await productRepository.getById(id);
        const result = await productRepository.updateById(id, data);
        eventBus.emit<TProductEvents['product.updated']>('product.updated', { prev, next: result });
        return result;
    }
};
