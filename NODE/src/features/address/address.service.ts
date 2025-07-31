import { eventBus } from "@/libs/event-bus-client";

import { TAddressEvents } from "./address.events";
import { addressRepository } from "./address.repository";
import { TAddress } from "./address.schema";
import { propertyService } from "../property";

export const addressService = {
    create: async (data: Omit<Partial<TAddress>, 'id'>): Promise<TAddress> => {
        let newData = { ...data };
        if (data.propertyId) {
            // If there is a propertyId, we need to get the property and merge the data
            const property = await propertyService.getById(data.propertyId);
            newData = { ...property, ...newData };
        }
        const result = await addressRepository.create(data);
        eventBus.emit<TAddressEvents['address.created']>('address.created', result);
        return result;
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        const { userId } = await addressRepository.getById(id);
        await addressRepository.deleteById(id, hardDelete);
        eventBus.emit<TAddressEvents['address.deleted']>('address.deleted', { id, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: Partial<Pick<TAddress, 'userId' | 'city' | 'state' | 'zip'>>,
    ): Promise<{ data: TAddress[], total: number }> => {
        return addressRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
    ): Promise<{ data: TAddress[], total: number }> => {
        const query = { userId };
        return addressRepository.find(limit, page, query);
    },

    getById: async (id: string): Promise<TAddress> => {
        return await addressRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TAddress>): Promise<TAddress> => {
        const prev = await addressRepository.getById(id);
        const result = await addressRepository.updateById(id, data);
        eventBus.emit<TAddressEvents['address.updated']>('address.updated', { prev, next: result });
        return result;
    },
}; 