import { eventBus } from "@/libs/event-bus-client";

import { TWasherProductFindQueryDTO } from "./washer-product.controller.dto";
import { TWasherProductEvents } from "./washer-product.events";
import { washerProductRepository } from "./washer-product.repository";
import { type TWasherProduct } from "./washer-product.schema";

export const washerProductService = {
    create: async (data: Omit<Partial<TWasherProduct>, 'id'>): Promise<TWasherProduct> => {
        const result = await washerProductRepository.create(data);
        eventBus.emit<TWasherProductEvents['washer-product.created']>('washer-product.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { userId } = await washerProductRepository.getById(id);
        await washerProductRepository.deleteById(id);
        eventBus.emit<TWasherProductEvents['washer-product.deleted']>('washer-product.deleted', { id, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TWasherProductFindQueryDTO
    ): Promise<{ data: TWasherProduct[], total: number }> => {
        return washerProductRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
        query?: Omit<TWasherProductFindQueryDTO, 'userId'>
    ): Promise<{ data: TWasherProduct[], total: number }> => {
        return washerProductRepository.find(limit, page, { userId, ...query });
    },

    findByProductId: async (
        productId: string,
        limit?: number,
        page?: number,
        query?: Omit<TWasherProductFindQueryDTO, 'productId'>
    ): Promise<{ data: TWasherProduct[], total: number }> => {
        return washerProductRepository.find(limit, page, { productId, ...query });
    },

    getById: async (id: string): Promise<TWasherProduct> => {
        return washerProductRepository.getById(id);
    },

    getByUserIdAndProductId: async (userId: string, productId: string): Promise<TWasherProduct> => {
        return washerProductRepository.getByUserIdAndProductId(userId, productId);
    },

    updateById: async (id: string, data: Partial<TWasherProduct>): Promise<TWasherProduct> => {
        const prev = await washerProductRepository.getById(id);
        const result = await washerProductRepository.updateById(id, data);
        eventBus.emit<TWasherProductEvents['washer-product.updated']>('washer-product.updated', { prev, next: result });
        return result;
    }
}; 