import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { washerProductCreateDTO, washerProductFindQueryDTO, washerProductUpdateDTO } from "./washer-product.controller.dto";
import { washerProductService } from "./washer-product.service";
import { TWasherProduct } from "./washer-product.schema";

export const washerProductController = {
    create: async (req: Request, res: Response) => {
        const parsed = washerProductCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washerProduct = await washerProductService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: washerProduct,
        } as TResponse<TWasherProduct>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { washerProductId } = req.params;
        if (!washerProductId) {
            throwInvalidRequestParam('WasherProductID is required');
        }
        await washerProductService.deleteById(washerProductId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerProductFindQueryDTO.safeParse(query);
        const { data, total } = await washerProductService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherProduct>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerProductFindQueryDTO.safeParse(query);
        const { data, total } = await washerProductService.findByUserId(userId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherProduct>);
    },

    findByProductId: async (req: Request, res: Response) => {
        const { productId } = req.params;
        if (!productId) {
            throwInvalidRequestParam('ProductID is required');
        }
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = washerProductFindQueryDTO.safeParse(query);
        const { data, total } = await washerProductService.findByProductId(productId, limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TWasherProduct>);
    },

    getById: async (req: Request, res: Response) => {
        const { washerProductId } = req.params;
        if (!washerProductId) {
            throwInvalidRequestParam('WasherProductID is required');
        }
        const washerProduct = await washerProductService.getById(washerProductId);
        res.status(200).json({
            status: 'ok',
            data: washerProduct,
        } as TResponse<TWasherProduct>);
    },

    getByUserIdAndProductId: async (req: Request, res: Response) => {
        const { userId, productId } = req.params;
        if (!userId || !productId) {
            throwInvalidRequestParam('UserID and ProductID are required');
        }
        const washerProduct = await washerProductService.getByUserIdAndProductId(userId, productId);
        res.status(200).json({
            status: 'ok',
            data: washerProduct,
        } as TResponse<TWasherProduct>);
    },

    updateById: async (req: Request, res: Response) => {
        const { washerProductId } = req.params;
        if (!washerProductId) {
            throwInvalidRequestParam('WasherProductID is required');
        }
        const parsed = washerProductUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const washerProduct = await washerProductService.updateById(washerProductId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: washerProduct,
        } as TResponse<TWasherProduct>);
    },
}; 