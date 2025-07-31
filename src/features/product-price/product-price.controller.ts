import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { productPriceCreateDTO, productPriceFindQueryDTO, productPriceGetByProductIdAndVehicleTypeDTO, productPriceUpdateDTO } from "./product-price.controller.dto";
import { productPriceService } from "./product-price.service";
import { TProductPrice } from "./product-price.schema";

export const productPriceController = {
    create: async (req: Request, res: Response) => {
        const parsed = productPriceCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const productPrice = await productPriceService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: productPrice,
        } as TResponse<TProductPrice>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { productPriceId } = req.params;
        if (!productPriceId) {
            throwInvalidRequestParam('ProductPriceID is required');
        }
        await productPriceService.deleteById(productPriceId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = productPriceFindQueryDTO.safeParse(query);
        const { data, total } = await productPriceService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TProductPrice>);
    },

    findByProductId: async (req: Request, res: Response) => {
        const { productId } = req.params;
        if (!productId) {
            throwInvalidRequestParam('ProductID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = productPriceFindQueryDTO.safeParse(query);
        const { data, total } = await productPriceService.findByProductId(productId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TProductPrice>);
    },

    getById: async (req: Request, res: Response) => {
        const { productPriceId } = req.params;
        if (!productPriceId) {
            throwInvalidRequestParam('ProductPriceID is required');
        }
        const productPrice = await productPriceService.getById(productPriceId);
        res.status(200).json({
            status: 'ok',
            data: productPrice,
        } as TResponse<TProductPrice>);
    },

    getByProductIdAndVehicleType: async (req: Request, res: Response) => {
        const parsed = productPriceGetByProductIdAndVehicleTypeDTO.safeParse(req.params);
        if (!parsed.success) {
            throwInvalidRequestParam('ProductID and VehicleType are required');
        }
        const { productId, vehicleType } = parsed.data;
        const productPrice = await productPriceService.getByProductIdAndVehicleType(productId, vehicleType);
        res.status(200).json({
            status: 'ok',
            data: productPrice,
        } as TResponse<TProductPrice>);
    },

    updateById: async (req: Request, res: Response) => {
        const { productPriceId } = req.params;
        if (!productPriceId) {
            throwInvalidRequestParam('ProductPriceID is required');
        }
        const parsed = productPriceUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const productPrice = await productPriceService.updateById(productPriceId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: productPrice,
        } as TResponse<TProductPrice>);
    },
};
