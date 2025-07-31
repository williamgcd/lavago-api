import { validatorUtils } from "@/utils/validators";
import { z } from "zod";
import { USER_DOCUMENT_TYPES } from "./user.schema";

export const userDTO = z.object({
    id: z.string(),
    name: z.string().optional(),

    phone: z.string().transform(phone => {
        return validatorUtils.validatePhone(phone);
    }),

    email: z.email().transform(email => {
        return validatorUtils.validateEmail(email);
    }).optional(),
    
    document: z.string().transform(document => {
        return validatorUtils.validateCpf(document);
    }).optional(),
    documentType: z.enum(USER_DOCUMENT_TYPES).optional().default('cpf'),

    referralCode: z.string().optional(),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export type TUserDTO = z.infer<typeof userDTO>;