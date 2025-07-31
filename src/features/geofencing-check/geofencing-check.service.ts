import { eventBus } from "@/libs/event-bus-client";

import { TGeofencingCheckFindQueryDTO } from "./geofencing-check.controller.dto";
import { TGeofencingCheckEvents } from "./geofencing-check.events";
import { geofencingCheckRepository } from "./geofencing-check.repository";
import { type TGeofencingCheck } from "./geofencing-check.schema";
import { RecordNotFoundError } from "@/errors";
import { gmapsGeocodingClient } from "@/libs/gmaps-geocoding-client";
import { geofencingCityService } from "../geofencing-city";

export const geofencingCheckService = {
    create: async (data: Omit<Partial<TGeofencingCheck>, 'id'>): Promise<TGeofencingCheck> => {
        const result = await geofencingCheckRepository.create(data);
        eventBus.emit<TGeofencingCheckEvents['geofencing-check.created']>('geofencing-check.created', result);
        return result;
    },

    checkByZip: async (zip: string): Promise<{ isSupported: boolean }> => {
        let check: TGeofencingCheck = {} as TGeofencingCheck;

        try {
            const check = await geofencingCheckRepository.getByZip(zip);
            if (check.isSupported !== null && check.washerCount > 0) {
                return { isSupported: check.isSupported };
            }
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('geofencingCheckService.checkByZip', err);
                throw err;
            }
        }

        let isSupported = false;

        // Is it from a supported city?
        try {
            const geofencingCity = await geofencingCityService.getByZip(zip);
            isSupported = geofencingCity.isSupported ?? false;
        } catch (err) {
            if (err instanceof RecordNotFoundError) {
                isSupported = false;
            }
            console.error('geofencingCheckService.checkByZip', 'geofencingCityService.getByZip', err);
            throw err;
        }

        // If there is no check, create a new one;
        if (!check) {
            try {
                const { lat, lng } = await gmapsGeocodingClient.geocodeZipcode(zip);
                check = await geofencingCheckService.create({ zip, lat, lng, isSupported });
                return { isSupported };
            } catch (err) {
                console.error('geofencingCheckService.checkByZip', 'invalid zip', err);
                return { isSupported: false };
            }
        }

        // TODO: We can check if there is a Washer that supports this zip;
        // Update the existing check;
        await geofencingCheckService.updateById(check.id, { isSupported });
        return { isSupported };
    },

    deleteById: async (id: string): Promise<void> => {
        const { zip } = await geofencingCheckRepository.getById(id);
        await geofencingCheckRepository.deleteById(id);
        eventBus.emit<TGeofencingCheckEvents['geofencing-check.deleted']>('geofencing-check.deleted', { id, zip });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TGeofencingCheckFindQueryDTO
    ): Promise<{ data: TGeofencingCheck[], total: number }> => {
        return geofencingCheckRepository.find(limit, page, query);
    },

    getById: async (id: string): Promise<TGeofencingCheck> => {
        return geofencingCheckRepository.getById(id);
    },

    getByZip: async (zip: string): Promise<TGeofencingCheck> => {
        return geofencingCheckRepository.getByZip(zip);
    },

    updateById: async (id: string, data: Partial<TGeofencingCheck>): Promise<TGeofencingCheck> => {
        const prev = await geofencingCheckRepository.getById(id);
        const result = await geofencingCheckRepository.updateById(id, data);
        eventBus.emit<TGeofencingCheckEvents['geofencing-check.updated']>('geofencing-check.updated', { prev, next: result });
        return result;
    },
};
