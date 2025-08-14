import { Request, Response } from 'express';

import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    getByZipCode: async (req: Request, res: Response) => {
        const values = req.params || req.query || req.body;
        const parsed = d.GeofenceDtoByZipCode.parse(values);
        const { zip_code } = parsed;

        const record = await serv.getByZipCode(zip_code);
        return respond.success(res, d.GeofenceDtoPublic.parse(record));
    },
};

export { ctrl, ctrl as geofenceController };
export default ctrl;
