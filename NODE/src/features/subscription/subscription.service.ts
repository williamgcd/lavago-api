import { eventBus } from "@/libs/event-bus-client";

import { TSubscriptionEvents } from "./subscription.events";
import { subscriptionRepository } from "./subscription.repository";
import { TSubscription } from "./subscription.schema";
import { TSubscriptionFindQueryDTO } from "./subscription.controller.dto";

export const subscriptionService = {
    create: async (subscription: Omit<Partial<TSubscription>, 'id'>): Promise<TSubscription> => {
        const result = await subscriptionRepository.create(subscription);
        eventBus.emit<TSubscriptionEvents['subscription.created']>('subscription.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        await subscriptionRepository.deleteById(id);
        eventBus.emit<TSubscriptionEvents['subscription.deleted']>('subscription.deleted', { id });
    },

    find: async (
        limit: number,
        page: number,
        query?: TSubscriptionFindQueryDTO,
    ): Promise<{ data: TSubscription[], total: number }> => {
        return subscriptionRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit: number,
        page: number,
        query?: Omit<TSubscriptionFindQueryDTO, 'userId'>,
    ): Promise<{ data: TSubscription[], total: number }> => {
        return subscriptionRepository.find(limit, page, { userId, ...query });
    },

    findByProductId: async (
        productId: string,
        limit: number,
        page: number,
        query?: Omit<TSubscriptionFindQueryDTO, 'productId'>,
    ): Promise<{ data: TSubscription[], total: number }> => {
        return subscriptionRepository.find(limit, page, { productId, ...query });
    },

    getById: async (id: string): Promise<TSubscription> => {
        return subscriptionRepository.getById(id);
    },

    updateById: async (id: string, subscription: Partial<TSubscription>): Promise<TSubscription> => {
        const prev = await subscriptionRepository.getById(id);
        const next = await subscriptionRepository.updateById(id, subscription);
        eventBus.emit<TSubscriptionEvents['subscription.updated']>('subscription.updated', { prev, next });
        return next;
    },
};
