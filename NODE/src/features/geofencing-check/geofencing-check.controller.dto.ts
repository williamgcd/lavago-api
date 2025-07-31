import { z } from "zod";
import { geofencingCheckDTO } from "./geofencing-check.dto";
import { validatorUtils } from "@/utils/validators";

export const geofencingCheckCreateDTO = geofencingCheckDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TGeofencingCheckCreateDTO = z.infer<typeof geofencingCheckCreateDTO>;

export const geofencingCheckFindQueryDTO = geofencingCheckDTO.pick({
    isSupported: true,
    washerCount: true,
}).partial();
export type TGeofencingCheckFindQueryDTO = z.infer<typeof geofencingCheckFindQueryDTO>;

export const geofencingCheckGetByZipDTO = z.object({
    zip: z.string().transform(zip => {
        return validatorUtils.validateZip(zip);
    }),
});
export type TGeofencingCheckGetByZipDTO = z.infer<typeof geofencingCheckGetByZipDTO>;

export const geofencingCheckUpdateDTO = geofencingCheckDTO.partial().omit({ 
    id: true,
    zip: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TGeofencingCheckUpdateDTO = z.infer<typeof geofencingCheckUpdateDTO>;
