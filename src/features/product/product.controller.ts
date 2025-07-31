import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { productCreateDTO, productFindQueryDTO, productUpdateDTO } from "./product.controller.dto";
import { productService } from "./product.service";
import { TProduct } from "./product.schema";

export const productController = {
    create: async (req: Request, res: Response) => {
        const parsed = productCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const product = await productService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: product,
        } as TResponse<TProduct>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { productId } = req.params;
        if (!productId) {
            throwInvalidRequestParam('ProductID is required');
        }
        await productService.deleteById(productId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = productFindQueryDTO.safeParse(query);
        const { data, total } = await productService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TProduct>);
    },

    getById: async (req: Request, res: Response) => {
        const { productId } = req.params;
        if (!productId) {
            throwInvalidRequestParam('ProductID is required');
        }
        const product = await productService.getById(productId);
        res.status(200).json({
            status: 'ok',
            data: product,
        } as TResponse<TProduct>);
    },

    updateById: async (req: Request, res: Response) => {
        const { productId } = req.params;
        if (!productId) {
            throwInvalidRequestParam('ProductID is required');
        }
        const parsed = productUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const product = await productService.updateById(productId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: product,
        } as TResponse<TProduct>);
    },
};
