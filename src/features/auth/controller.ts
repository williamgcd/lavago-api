import { Request, Response } from 'express';
import { respond } from '@/shared/helpers/respond';

import * as d from './dto';
import { serv } from './service';

const ctrl = {
    create: async (req: Request, res: Response) => {
        const values = d.AuthDtoCreate.parse(req.body || req.query);
        await serv.create(values);
        return respond.message(res, 'User registered succesfully');
    },

    getUser: async (req: Request, res: Response) => {
        const record = await serv.getUser();
        return respond.success(res, record);
    },

    otpEmail: async (req: Request, res: Response) => {
        const values = d.AuthDtoOtpEmailCheck.parse(req.body || req.query);
        const { email, otp } = values;

        if (otp !== undefined) {
            const token = await serv.otpEmailCheck(email, otp);
            return respond.success(res, token);
        }
        await serv.otpEmailUpdate(email);
        return respond.message(res, 'OTP sent successfully');
    },

    otpPhone: async (req: Request, res: Response) => {
        const values = d.AuthDtoOtpPhoneCheck.parse(req.body || req.query);
        const { phone, otp } = values;

        if (otp !== undefined) {
            const token = await serv.otpPhoneCheck(phone, otp);
            return respond.success(res, token);
        }
        await serv.otpPhoneUpdate(phone);
        return respond.message(res, 'OTP sent successfully');
    },
};

export { ctrl, ctrl as authController };
export default ctrl;
