import { Request, Response } from "express";
import { PAGINATION } from "@/constants/pagination";
import { throwInvalidRequestBody, throwInvalidRequestParam } from "@/errors";
import { TResponse, TResponsePaginated } from "@/types/responses";

import { couponCreateDTO, couponFindQueryDTO, couponUpdateDTO } from "./coupon.controller.dto";
import { couponService } from "./coupon.service";
import { TCoupon } from "./coupon.schema";

export const couponController = {
    create: async (req: Request, res: Response) => {
        const parsed = couponCreateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const coupon = await couponService.create(parsed.data);
        res.status(201).json({
            status: 'ok',
            data: coupon,
        } as TResponse<TCoupon>);
    },

    deleteById: async (req: Request, res: Response) => {
        const { couponId } = req.params;
        if (!couponId) {
            throwInvalidRequestParam('CouponID is required');
        }
        await couponService.deleteById(couponId);
        res.status(204).json({ 
            status: 'ok'
        } as TResponse<void>);
    },

    find: async (req: Request, res: Response) => {
        const { limit, page, ...query } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const parsedQuery = couponFindQueryDTO.safeParse(query);
        const { data, total } = await couponService.find(limitAsNumber, pageAsNumber, parsedQuery.data);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TCoupon>);
    },

    findByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) {
            throwInvalidRequestParam('UserID is required');
        }
        const { limit, page } = req.query;
        const limitAsNumber = limit ? Number(limit) : PAGINATION.DEFAULT_LIMIT;
        const pageAsNumber = page ? Number(page) : 1;

        const { data, total } = await couponService.findByUserId(userId, limitAsNumber, pageAsNumber);

        res.status(200).json({
            status: 'ok',
            data,
            pagination: {
                total,
                totalPages: Math.ceil(total / limitAsNumber),
            },
        } as TResponsePaginated<TCoupon>);
    },

    getById: async (req: Request, res: Response) => {
        const { couponId } = req.params;
        if (!couponId) {
            throwInvalidRequestParam('CouponID is required');
        }
        const coupon = await couponService.getById(couponId);
        res.status(200).json({
            status: 'ok',
            data: coupon,
        } as TResponse<TCoupon>);
    },

    getByCode: async (req: Request, res: Response) => {
        const { code } = req.params;
        if (!code) {
            throwInvalidRequestParam('Code is required');
        }
        const coupon = await couponService.getByCode(code);
        res.status(200).json({
            status: 'ok',
            data: coupon,
        } as TResponse<TCoupon>);
    },

    updateById: async (req: Request, res: Response) => {
        const { couponId } = req.params;
        if (!couponId) {
            throwInvalidRequestParam('CouponID is required');
        }
        const parsed = couponUpdateDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const coupon = await couponService.updateById(couponId, parsed.data);
        res.status(200).json({
            status: 'ok',
            data: coupon,
        } as TResponse<TCoupon>);
    },

    useCoupon: async (req: Request, res: Response) => {
        const { couponId } = req.params;
        const { userId } = req.body;
        if (!couponId) {
            throwInvalidRequestParam('CouponID is required');
        }
        if (!userId) {
            throwInvalidRequestBody();
        }
        const coupon = await couponService.useCoupon(couponId, userId);
        res.status(200).json({
            status: 'ok',
            data: coupon,
        } as TResponse<TCoupon>);
    },
};
