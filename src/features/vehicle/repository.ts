import { ZodObject } from 'zod';

import { throwRecordMissing } from '@/errors';
import { createDbClient } from '@/shared/clients/db';
import { TPagination } from '@/shared/types/pagination';

import * as d from './dto';
import * as t from './types';

const db = createDbClient('vehicles');

const repo = {
    parse: async (data: Partial<t.TVehicleDto>, schema: ZodObject) => {
        try {
            return schema.parseAsync(data);
        } catch (err) {
            console.error('vehicle.repo.parse', err);
            throw err;
        }
    },

    /**
     * Creates a new vehicle record
     * @params values - the vehicle values to create
     * @returns the created vehicle record
     */
    create: async (values: Partial<t.TVehicleDto>): Promise<t.TVehicleDto> => {
        const data = { ...values } as Partial<t.TVehicleDto>;
        await repo.parse(data, d.VehicleDtoCreate);

        try {
            // Add record to the database;
            const created = await db.create(data);
            return d.VehicleDto.parse(created);
        } catch (err) {
            console.error('vehicle.repo.create', err);
            throw err;
        }
    },

    /**
     * Delete a vehicle record
     * @param id - The id of the vehicle record to delete
     * @param existing - The existing vehicle record
     * @returns void
     */
    delete: async (
        id: t.TVehicleDto['id'],
        existing?: t.TVehicleDto,
        hard: boolean = false
    ): Promise<void> => {
        try {
            let record = existing;
            if (!existing) {
                record = await repo.getById(id);
            }
            // Delete record from the database;
            if (hard === true) {
                await db.deleteHard(record.id);
                return;
            }
            await db.deleteSoft(record.id);
        } catch (err) {
            console.error('vehicle.repo.delete', err);
            throw err;
        }
    },

    /**
     * Get a vehicle record by id
     * @param value - The id of the vehicle record to get
     * @returns The vehicle record
     */
    getById: async (value: t.TVehicleDto['id']): Promise<t.TVehicleDto> => {
        try {
            const data = await db.single({
                id: { op: 'eq', value },
                deleted_at: { op: 'is', value: null },
            });
            if (!data || !data.id) {
                throwRecordMissing('Vehicle');
            }
            return d.VehicleDto.parse(data);
        } catch (err) {
            console.error('vehicle.repo.getById', err);
            throw err;
        }
    },

    /**
     * List vehicle records
     * @param filters - The filters to apply to the vehicle records
     * @param pagination - The pagination to apply to the vehicle records
     * @returns The vehicle records
     */
    list: async (
        filters: t.TVehicleDtoFilter,
        pagination?: TPagination
    ): Promise<{ count: number; data: t.TVehicleDto[] }> => {
        const where: any = {};

        try {
            const { count, data } = await db.select(where, pagination);
            return { count, data: data.map(r => d.VehicleDto.parse(r)) };
        } catch (err) {
            console.error('vehicle.repo.list', err);
            throw err;
        }
    },

    /**
     * Update a vehicle record
     * @param id - The id of the vehicle record to update
     * @param values - The vehicle values to update
     * @param existing - The existing vehicle record
     * @returns The updated vehicle record
     */
    update: async (
        id: t.TVehicleDto['id'],
        values: Partial<t.TVehicleDto>,
        existing?: t.TVehicleDto
    ): Promise<t.TVehicleDto> => {
        const data = { ...values } as Partial<t.TVehicleDto>;
        await repo.parse(values, d.VehicleDtoUpdate);

        let record = existing;
        if (!existing) {
            record = await repo.getById(id);
        }

        // Remove fields that should not be updated
        // These are usually the filters checked on getExisting;
        delete data.id;
        delete data.user_id;

        // Set default update fields
        data.updated_at = new Date();

        try {
            // Updates record on the database;
            const updated = await db.update(record.id, data);
            return d.VehicleDto.parse(updated);
        } catch (err) {
            console.error('vehicle.repo.update', err);
            throw err;
        }
    },
};

export { repo, repo as vehicleRepository };
export default repo;
