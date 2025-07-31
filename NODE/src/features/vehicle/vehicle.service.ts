import { eventBus } from "@/libs/event-bus-client";

import { TVehicleFindQueryDTO } from "./vehicle.controller.dto";
import { TVehicleEvents } from "./vehicle.events";
import { vehicleRepository } from "./vehicle.repository";
import { TVehicle } from "./vehicle.schema";

export const vehicleService = {
    create: async (data: Omit<Partial<TVehicle>, 'id'>): Promise<TVehicle> => {
        const result = await vehicleRepository.create(data);
        eventBus.emit<TVehicleEvents['vehicle.created']>('vehicle.created', result);
        return result;
    },

    deleteById: async (id: string, hardDelete: boolean = false): Promise<void> => {
        const { userId } = await vehicleRepository.getById(id);
        await vehicleRepository.deleteById(id, hardDelete);
        eventBus.emit<TVehicleEvents['vehicle.deleted']>('vehicle.deleted', { id, userId });
    },

    find: async (
        limit?: number,
        page?: number,
        query?: TVehicleFindQueryDTO,
    ): Promise<{ data: TVehicle[], total: number }> => {
        return vehicleRepository.find(limit, page, query);
    },

    findByUserId: async (
        userId: string,
        limit?: number,
        page?: number,
        query?: Omit<TVehicleFindQueryDTO, 'userId'>,
    ): Promise<{ data: TVehicle[], total: number }> => {
        return vehicleRepository.find(limit, page, { userId, ...query });
    },

    getById: async (id: string): Promise<TVehicle> => {
        return await vehicleRepository.getById(id);
    },

    updateById: async (id: string, data: Partial<TVehicle>): Promise<TVehicle> => {
        const prev = await vehicleRepository.getById(id);
        const result = await vehicleRepository.updateById(id, data);
        eventBus.emit<TVehicleEvents['vehicle.updated']>('vehicle.updated', { prev, next: result });
        return result;
    },
};
