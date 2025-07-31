import { Request, Response } from "express";
import { throwInvalidRequestParam } from "@/errors";
import { TResponse } from "@/types/responses";

import { geofencingService } from "./geofencing.service";
import { TGeofencing } from "./geofencing.types";
import { geofencingCheckZipDTO } from "./geofencing.controller.dto";

export const geofencingController = {
    checkZip: async (req: Request, res: Response) => {
        const { zip } = req.params;
        if (!zip) {
            throwInvalidRequestParam('Zip is required');
        }
        const parsed = geofencingCheckZipDTO.safeParse(req.params);
        if (!parsed.success) {
            throwInvalidRequestParam('Zip is required');
        }
        const geofencing = await geofencingService.checkZip(parsed.data.zip);
        res.status(200).json({
            status: 'ok',
            data: geofencing,
        } as TResponse<TGeofencing>);
    },
};