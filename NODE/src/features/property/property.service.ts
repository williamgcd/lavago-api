import { eventBus } from "@/libs/event-bus-client";

import { TPropertyFindQueryDTO } from "./property.controller.dto";
import { TPropertyEvents } from "./property.events";
import { propertyRepository } from "./property.repository";
import { type TProperty } from "./property.schema";
import { PAGINATION } from "@/constants";
import { propertyHourRepository, propertyHourService } from "../property-hour";
import { TPropertyPublicDTO } from "./property.dto";

export const propertyService = {
    create: async (data: Omit<Partial<TProperty>, 'id'>): Promise<TProperty> => {
        const result = await propertyRepository.create(data);
        eventBus.emit<TPropertyEvents['property.created']>('property.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        await propertyRepository.getById(id);
        await propertyRepository.deleteById(id);
        eventBus.emit<TPropertyEvents['property.deleted']>('property.deleted', { id });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TPropertyFindQueryDTO
    ): Promise<{ data: TProperty[], total: number }> => {
        return propertyRepository.find(limit, page, query);
    },

    findByZip: async (zip: string): Promise<{ data: TProperty[], total: number }> => {
        return propertyRepository.find(PAGINATION.DEFAULT_LIMIT_MAX, 1, { zip });
    },

    getById: async (id: string): Promise<TProperty> => {
        return propertyRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TProperty>): Promise<TProperty> => {
        const prev = await propertyRepository.getById(id);
        const result = await propertyRepository.updateById(id, data);
        eventBus.emit<TPropertyEvents['property.updated']>('property.updated', { prev, next: result });
        return result;
    },

    toPublicDTO: async (property: TProperty): Promise<TPropertyPublicDTO> => {
        const { data: hours } = await propertyHourService.findByPropertyId(property.id);
        return { ...property, hours } as TPropertyPublicDTO;
    },
};
