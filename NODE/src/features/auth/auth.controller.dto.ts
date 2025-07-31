import { validatorUtils } from "@/utils/validators";
import { z } from "zod";

export const authOTPSendDTO = z.object({
    phone: z.string().transform(phone => {
        return validatorUtils.validatePhone(phone);
    }),
});

export const authOTPCheckDTO = z.object({
    phone: z.string().transform(phone => {
        return validatorUtils.validatePhone(phone);
    }),
    otp: z.string().min(1),
});