import { propertyService } from "../property/property.service";
import { TProperty } from "../property";

import { geofencingCheckService } from "../geofencing-check/geofencing-check.service";
import { TGeofencing, TGeofencingProperty } from "./geofencing.types";

const mapProperties = (
    p: TProperty
): TGeofencingProperty => ({
    id: p.id,
    name: p.name,
    address: `${p.street}, ${p.number} - ${p.neighborhood} - ${p.city}/${p.state}`,
    zip: p.zip,
    isSupported: p.isSupported !== null && p.isSupported,
});

export const geofencingService = {
    checkZip: async (zip: string): Promise<TGeofencing> => {
        try {
            // Is it from a property?
            const { data: properties } = await propertyService.findByZip(zip);
            // There is only one property? Infer from it;
            if (properties.length === 1 && properties[0].isSupported !== null) {
                return { 
                    isSupported: properties[0].isSupported,
                    properties: properties.map(mapProperties),
                } as TGeofencing;
            }
            if (properties.length > 0) {
                // There are multiple properties? Check if any of them are supported;
                const isSupported = properties.every(p => p.isSupported !== null && p.isSupported);
                return {
                    isSupported,
                    properties: properties.map(mapProperties),
                } as TGeofencing;
            }
        } catch (err) {
            console.error('geofencingService.checkZip', 'propertyService.findByZip', err);
            throw err;
        }

        try {
            // Is it from a check (checks are cached searches)
            const { isSupported } = await geofencingCheckService.checkByZip(zip);
            return { isSupported } as TGeofencing;
        } catch (err) {
            console.error('geofencingService.checkZip', 'geofencingCheckService.getByZip', err);
            throw err;
        }
    },
};
