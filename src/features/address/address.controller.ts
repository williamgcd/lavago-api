import { Request, Response } from 'express';
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from '@/types/responses';
import { PAGINATION } from '@/constants/pagination';

import { addressCreateDTO, addressFindQueryDTO, addressUpdateDTO } from "./address.controller.dto";
import { addressService } from "./address.service";
import { TAddress } from './address.schema';

export const addressController = {
    create: async (req: Request, res: Response) => {
        const parsed = addressCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const address = await addressService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: address,
        } as TResponse<TAddress>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { addressId } = req.params;
        if (!addressId) {
            throwInvalidRequestParam('AddressID is required');
        }
        await addressService.deleteById(addressId);
        res.status(204).json({ status: 'ok' } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = addressFindQueryDTO.safeParse(query);
        const { data, total } = await addressService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TAddress>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }

        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const page = req.query.page ? Number(req.query.page) : undefined;

        const result = await addressService.findByUserId(userId, limit, page);
        res.status(200).json({
            status: 'ok',
            data: result.data,
            pagination: {
                total: result.total,
                page: page || 1,
                limit: limit || 10,
            },
        } as TResponse<TAddress[]>);
    },

    getById: async (req: Request, res: Response) => {
        const { addressId } = req.params;
        if (!addressId) {
            throwInvalidRequestParam('AddressID is required');
        }
        const address = await addressService.getById(addressId);
        res.status(200).json({ status: 'ok', data: address } as TResponse<TAddress>);
    },

    updateById: async (req: Request, res: Response) => {
        const { addressId } = req.params;
        if (!addressId) {
            throwInvalidRequestParam('AddressID is required');
        }

        const parsed = addressUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }

        const address = await addressService.updateById(addressId, parsed.data);
        res.status(200).json({ status: 'ok', data: address } as TResponse<TAddress>);
    },
}; 