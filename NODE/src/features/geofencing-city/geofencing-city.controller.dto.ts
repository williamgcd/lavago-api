import { z } from "zod";
import { geofencingCityDTO } from "./geofencing-city.dto";
import { validatorUtils } from "@/utils/validators";

export const geofencingCityCreateDTO = geofencingCityDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TGeofencingCityCreateDTO = z.infer<typeof geofencingCityCreateDTO>;

export const geofencingCityFindQueryDTO = geofencingCityDTO.pick({
    isSupported: true,
    country: true,
    state: true,
    city: true,
}).partial();
export type TGeofencingCityFindQueryDTO = z.infer<typeof geofencingCityFindQueryDTO>;

export const geofencingCityGetByZipDTO = z.object({
    zip: z.string().transform(zip => {
        return validatorUtils.validateZip(zip);
    }),
});
export type TGeofencingCityGetByZipDTO = z.infer<typeof geofencingCityGetByZipDTO>;

export const geofencingCityUpdateDTO = geofencingCityDTO.partial().omit({ 
    id: true,
    identifier: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TGeofencingCityUpdateDTO = z.infer<typeof geofencingCityUpdateDTO>;
