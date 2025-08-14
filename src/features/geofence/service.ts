import { AREA_ZIPCODES } from '@/shared/constants/zipcodes';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';
import { normalizer } from '@/shared/utils/normalizer';
import { propertyService } from '../property/service';

const serv = {
    checkZipCodeInRange: async (
        zip_code: t.TGeofenceDtoByZipCode['zip_code']
    ) => {
        const zip = parseInt(zip_code);
        const ret = { is_supported: false };

        Object.values(AREA_ZIPCODES).forEach(city => {
            const { ini, end } = city;
            if (zip >= ini && zip <= end) {
                ret.is_supported = true;
            }
        });
        return ret.is_supported;
    },

    getByZipCode: async (zip_code: t.TGeofenceDtoByZipCode['zip_code']) => {
        const zip = normalizer.zipCode(zip_code);

        // Is the zip code within the supported range?
        let isSupported = await serv.checkZipCodeInRange(zip);
        if (!isSupported) {
            return d.GeofenceDto.parse({ is_supported: isSupported });
        }

        // Is there any properties with the zip code?
        const { data } = await propertyService.listByZipCode(zip);

        // No properties? Just return with the supported status;
        if (!data.length) {
            return d.GeofenceDto.parse({
                is_supported: isSupported,
                properties: data ?? [],
            });
        }

        // Single property? Infer the supported status from the property
        if (data.length === 1 && data[0].is_supported !== null) {
            isSupported = data[0].is_supported;
        }

        // Multiple properties? Infer the supported status from the properties
        if (data.length > 1) {
            isSupported = data.every(p => p.is_supported === true);
        }

        return d.GeofenceDto.parse({
            is_supported: isSupported,
            properties: data,
        });
    },
};

export { serv, serv as geofenceService };
export default serv;
