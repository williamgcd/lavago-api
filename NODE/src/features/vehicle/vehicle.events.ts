import { TVehicle } from './vehicle.schema';

export type TVehicleEvents = {
    'vehicle.created': TVehicle;
    'vehicle.updated': { prev: TVehicle; next: TVehicle };
    'vehicle.deleted': { id: string; userId: string;};
}
