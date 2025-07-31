import { TGeofencingCity } from "./geofencing-city.schema";

export type TGeofencingCityEvents = {
    'geofencing-city.created': TGeofencingCity;
    'geofencing-city.updated': {
        prev: TGeofencingCity;
        next: TGeofencingCity;
    };
    'geofencing-city.deleted': {
        id: string;
        identifier: string;
    };
};
