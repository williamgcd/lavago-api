import { validatorUtils } from "@/utils/validators";
import { z } from "zod";

export const geofencingCheckZipDTO = z.object({
    zip: z.string().transform(zip => {
        return validatorUtils.validateZip(zip);
    }),
});
export type TGeofencingCheckZipDTO = z.infer<typeof geofencingCheckZipDTO>;