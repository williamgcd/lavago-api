import { and, count, eq, isNull, gte } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { RecordNotFoundError, throwRecordDuplicated, throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TGeofencingCheck, geofencingChecks } from "./geofencing-check.schema";
import { TGeofencingCheckFindQueryDTO } from "./geofencing-check.controller.dto";

export const geofencingCheckRepository = {
    create: async (data: Omit<Partial<TGeofencingCheck>, 'id'>): Promise<TGeofencingCheck> => {
        const geofencingCheck = {...data } as TGeofencingCheck;

        // Check if the geofencing check is already created with same zip
        try {
            const { zip } = geofencingCheck;
            await geofencingCheckRepository.getByZip(zip);
            throwRecordDuplicated('Geofencing check already exists with same zip');
        } catch (err) {
            if (!(err instanceof RecordNotFoundError)) {
                console.error('geofencingCheckRepository.create', err);
                throw err;
            }
        }

        try {
            const result = await db.insert(geofencingChecks).values(geofencingCheck).returning();
            if (result.length === 0) {
                throw new Error('Geofencing check not created');
            }
            return result[0] as TGeofencingCheck;
        } catch (err) {
            console.error('geofencingCheckRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await geofencingCheckRepository.getById(id);
            await db.update(geofencingChecks)
                .set({ deletedAt: new Date() })
                .where(eq(geofencingChecks.id, id));
        } catch (err) {
            console.error('geofencingCheckRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TGeofencingCheckFindQueryDTO,
    ): Promise<{ data: TGeofencingCheck[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(geofencingChecks.deletedAt)
            ];

            if (query?.isSupported !== undefined) {
                where.push(eq(geofencingChecks.isSupported, query.isSupported!));
            }
            if (query?.washerCount !== undefined) {
                where.push(gte(geofencingChecks.washerCount, query.washerCount));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(geofencingChecks)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(geofencingChecks)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TGeofencingCheck[],
                total: Number(total)
            };
        } catch (err) {
            console.error('geofencingCheckRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TGeofencingCheck> => {
        try {
            const result = await db
                .select()
                .from(geofencingChecks)
                .where(and(
                    eq(geofencingChecks.id, id),
                    isNull(geofencingChecks.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Geofencing check not found');
            }
            return result[0] as TGeofencingCheck;
        } catch (err) {
            console.error('geofencingCheckRepository.getById', err);
            throw err;
        }
    },

    getByZip: async (zip: string): Promise<TGeofencingCheck> => {
        try {
            const result = await db
                .select()
                .from(geofencingChecks)
                .where(and(
                    eq(geofencingChecks.zip, zip),
                    isNull(geofencingChecks.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Geofencing check not found');
            }
            return result[0] as TGeofencingCheck;
        } catch (err) {
            console.error('geofencingCheckRepository.getByZip', err);
            throw err;
        }
    },

    updateById: async (id: string, geofencingCheck: Partial<TGeofencingCheck>): Promise<TGeofencingCheck> => {
        try {
            const current = await geofencingCheckRepository.getById(id);

            // Build updateData object only with defined values;
            const updateData: Partial<TGeofencingCheck> = Object.fromEntries(
                Object.entries(geofencingCheck).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return geofencingCheckRepository.getById(id);
            }

            // Fields that are not allowed to be updated
            delete updateData.zip;

            const result = await db.update(geofencingChecks)
                .set(updateData)
                .where(eq(geofencingChecks.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Geofencing check not found');
            }
            return result[0] as TGeofencingCheck;
        } catch (err) {
            console.error('geofencingCheckRepository.updateById', err);
            throw err;
        }
    },
};
