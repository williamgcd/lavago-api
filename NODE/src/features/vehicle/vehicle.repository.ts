import { and, count, eq, isNull, like } from "drizzle-orm";

import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TVehicleFindQueryDTO } from "./vehicle.controller.dto";
import { TVehicle, vehicles } from "./vehicle.schema";

export const vehicleRepository = {
    create: async (data: Omit<Partial<TVehicle>, 'id'>): Promise<TVehicle> => {
        const vehicle = {...data } as TVehicle;

        try {
            const result = await db.insert(vehicles).values(vehicle).returning();
            if (result.length === 0) {
                throw new Error('Vehicle not created');
            }
            return result[0] as TVehicle;
        } catch (err) {
            console.error('vehicleRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        try {
            const result = await vehicleRepository.getById(id);
            if (hardDelete) {
                await db.delete(vehicles).where(eq(vehicles.id, result.id));
                return;
            }
            await db.update(vehicles)
                .set({ deletedAt: new Date() })
                .where(eq(vehicles.id, result.id));
        } catch (err) {
            console.error('vehicleRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TVehicleFindQueryDTO,
    ): Promise<{ data: TVehicle[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(vehicles.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(vehicles.userId, query.userId));
            }
            if (query?.type) {
                where.push(eq(vehicles.type, query.type));
            }
            if (query?.brand) {
                where.push(like(vehicles.brand, `${query.brand}%`));
            }
            if (query?.model) {
                where.push(like(vehicles.model, `${query.model}%`));
            }
            if (query?.color) {
                where.push(like(vehicles.color, `${query.color}%`));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(vehicles)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(vehicles)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TVehicle[],
                total: Number(total)
            };
        } catch (err) {
            console.error('vehicleRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TVehicle> => {
        try {
            const result = await db
                .select()
                .from(vehicles)
                .where(and(
                    eq(vehicles.id, id),
                    isNull(vehicles.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Vehicle not found');
            }
            return result[0] as TVehicle;
        } catch (err) {
            console.error('vehicleRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, vehicle: Partial<TVehicle>): Promise<TVehicle> => {
        try {
            const updateData: Partial<TVehicle> = Object.fromEntries(
                Object.entries(vehicle).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return vehicleRepository.getById(id);
            }

            const result = await db.update(vehicles)
                .set(updateData)
                .where(eq(vehicles.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Vehicle not found');
            }
            return result[0] as TVehicle;
        } catch (err) {
            console.error('vehicleRepository.updateById', err);
            throw err;
        }
    }
};
