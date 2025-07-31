export type TGeofencingProperty = {
    id: string;
    name: string;
    address: string;
    zip: string;
    isSupported: boolean;
}

export type TGeofencing = {
    isSupported: boolean;
    properties?: TGeofencingProperty[];
}