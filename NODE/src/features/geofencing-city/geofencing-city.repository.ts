import { and, count, eq, isNull, like, gte, lte, is } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TGeofencingCity, geofencingCities } from "./geofencing-city.schema";
import { TGeofencingCityFindQueryDTO } from "./geofencing-city.controller.dto";

export const geofencingCityRepository = {
    create: async (data: Omit<Partial<TGeofencingCity>, 'id'>): Promise<TGeofencingCity> => {
        const geofencingCity = {...data } as TGeofencingCity;

        // Check if the geofencing city is already created with same identifier
        try {
            const { identifier } = geofencingCity;
            await geofencingCityRepository.getByIdentifier(identifier);
            throwRecordDuplicated('Geofencing city already exists with same identifier');
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('geofencingCityRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(geofencingCities).values(geofencingCity).returning();
            if (result.length === 0) {
                throw new Error('Geofencing city not created');
            }
            return result[0] as TGeofencingCity;
        } catch (err) {
            console.error('geofencingCityRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await geofencingCityRepository.getById(id);
            await db.update(geofencingCities)
                .set({ deletedAt: new Date() })
                .where(eq(geofencingCities.id, id));
        } catch (err) {
            console.error('geofencingCityRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TGeofencingCityFindQueryDTO,
    ): Promise<{ data: TGeofencingCity[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(geofencingCities.deletedAt)
            ];

            if (query?.isSupported !== undefined) {
                where.push(eq(geofencingCities.isSupported, query.isSupported!));
            }
            if (query?.country) {
                where.push(eq(geofencingCities.country, query.country));
            }
            if (query?.country && query?.state) {
                where.push(like(geofencingCities.state, `%${query.state}%`));
            }
            if (query?.country && query?.state && query?.city) {
                where.push(like(geofencingCities.city, `%${query.city}%`));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(geofencingCities)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(geofencingCities)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TGeofencingCity[],
                total: Number(total)
            };
        } catch (err) {
            console.error('geofencingCityRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TGeofencingCity> => {
        try {
            const result = await db
                .select()
                .from(geofencingCities)
                .where(and(
                    eq(geofencingCities.id, id),
                    isNull(geofencingCities.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Geofencing city not found');
            }
            return result[0] as TGeofencingCity;
        } catch (err) {
            console.error('geofencingCityRepository.getById', err);
            throw err;
        }
    },

    getByIdentifier: async (identifier: string): Promise<TGeofencingCity> => {
        try {
            const result = await db
                .select()
                .from(geofencingCities)
                .where(eq(geofencingCities.identifier, identifier));
            if (!result.length) {
                throwRecordNotFound('Geofencing city not found');
            }
            return result[0] as TGeofencingCity;
        } catch (err) {
            console.error('geofencingCityRepository.getByIdentifier', err);
            throw err;
        }
    },

    getByZip: async (zip: string): Promise<TGeofencingCity> => {
        try {
            const result = await db
                .select()
                .from(geofencingCities)
                .where(and(
                    lte(geofencingCities.zipRangeStart, zip),
                    gte(geofencingCities.zipRangeEnd, zip),
                    isNull(geofencingCities.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Geofencing city not found');
            }
            return result[0] as TGeofencingCity;
        } catch (err) {
            console.error('geofencingCityRepository.getByZip', err);
            throw err;
        }
    },

    updateById: async (id: string, geofencingCity: Partial<TGeofencingCity>): Promise<TGeofencingCity> => {
        try {
            const current = await geofencingCityRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TGeofencingCity> = Object.fromEntries(
                Object.entries(geofencingCity).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return geofencingCityRepository.getById(id);
            }

            // Fields that are not allowed to be updated
            delete updateData.identifier;
            delete updateData.country;
            delete updateData.state;
            delete updateData.city;

            const result = await db.update(geofencingCities)
                .set(updateData)
                .where(eq(geofencingCities.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Geofencing city not found');
            }
            return result[0] as TGeofencingCity;
        } catch (err) {
            console.error('geofencingCityRepository.updateById', err);
            throw err;
        }
    }
};