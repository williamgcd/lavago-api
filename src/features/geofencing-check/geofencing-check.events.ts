import { TGeofencingCheck } from "./geofencing-check.schema";

export type TGeofencingCheckEvents = {
    'geofencing-check.created': TGeofencingCheck;
    'geofencing-check.updated': {
        prev: TGeofencingCheck;
        next: TGeofencingCheck;
    };
    'geofencing-check.deleted': {
        id: string;
        zip: string;
    };
};
