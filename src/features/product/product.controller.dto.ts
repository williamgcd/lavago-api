import { z } from "zod";
import { productDTO } from "./product.dto";

export const productCreateDTO = productDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TProductCreateDTO = z.infer<typeof productCreateDTO>;

export const productFindQueryDTO = productDTO.pick({
    mode: true,
    name: true,
}).partial();
export type TProductFindQueryDTO = z.infer<typeof productFindQueryDTO>;

export const productUpdateDTO = productDTO.partial().omit({ 
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TProductUpdateDTO = z.infer<typeof productUpdateDTO>;
