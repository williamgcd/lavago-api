import { Request, Response } from "express";

import { throwInvalidRequestBody } from "@/errors";
import { TResponse, TResponseMessage } from "@/types/responses";

import { authOTPCheckDTO, authOTPSendDTO } from "./auth.controller.dto";
import { authService } from "./auth.service";

export const authController = {
    otpCheck: async (req: Request, res: Response) => {
        const parsed = authOTPCheckDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        const token = await authService.otpCheck(parsed.data.phone, parsed.data.otp);
        res.status(200).json({
            status: 'ok',
            data: { token },
        } as TResponse<{ token: string }>);
    },

    otpSend: async (req: Request, res: Response) => {
        const parsed = authOTPSendDTO.safeParse(req.body);
        if (!parsed.success) {
            throwInvalidRequestBody();
        }
        await authService.otpSend(parsed.data.phone);
        res.status(201).json({
            status: 'ok',
            message: '',
        } as TResponseMessage);
    },
}