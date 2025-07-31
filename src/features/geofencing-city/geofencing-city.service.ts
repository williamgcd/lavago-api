import { eventBus } from "@/libs/event-bus-client";

import { TGeofencingCityFindQueryDTO } from "./geofencing-city.controller.dto";
import { TGeofencingCityEvents } from "./geofencing-city.events";
import { geofencingCityRepository } from "./geofencing-city.repository";
import { type TGeofencingCity } from "./geofencing-city.schema";

export const geofencingCityService = {
    create: async (data: Omit<Partial<TGeofencingCity>, 'id'>): Promise<TGeofencingCity> => {
        const result = await geofencingCityRepository.create(data);
        eventBus.emit<TGeofencingCityEvents['geofencing-city.created']>('geofencing-city.created', result);
        return result;
    },

    deleteById: async (id: string): Promise<void> => {
        const { identifier } = await geofencingCityRepository.getById(id);
        await geofencingCityRepository.deleteById(id);
        eventBus.emit<TGeofencingCityEvents['geofencing-city.deleted']>('geofencing-city.deleted', { id, identifier });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TGeofencingCityFindQueryDTO
    ): Promise<{ data: TGeofencingCity[], total: number }> => {
        return geofencingCityRepository.find(limit, page, query);
    },

    getById: async (id: string): Promise<TGeofencingCity> => {
        return geofencingCityRepository.getById(id);
    },

    getByIdentifier: async (identifier: string): Promise<TGeofencingCity> => {
        return geofencingCityRepository.getByIdentifier(identifier);
    },

    getByZip: async (zip: string): Promise<TGeofencingCity> => {
        return geofencingCityRepository.getByZip(zip);
    },

    updateById: async (id: string, data: Partial<TGeofencingCity>): Promise<TGeofencingCity> => {
        const prev = await geofencingCityRepository.getById(id);
        const result = await geofencingCityRepository.updateById(id, data);
        eventBus.emit<TGeofencingCityEvents['geofencing-city.updated']>('geofencing-city.updated', { prev, next: result });
        return result;
    }
};
