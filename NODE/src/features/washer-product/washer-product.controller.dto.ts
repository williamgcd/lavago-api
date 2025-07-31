import { z } from "zod";
import { washerProductDTO } from "./washer-product.dto";

export const washerProductCreateDTO = washerProductDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TWasherProductCreateDTO = z.infer<typeof washerProductCreateDTO>;

export const washerProductFindQueryDTO = washerProductDTO.pick({
    userId: true,
    productId: true,
    isPreferred: true,
    trainedBy: true,
    licensedBy: true,
}).partial();
export type TWasherProductFindQueryDTO = z.infer<typeof washerProductFindQueryDTO>;

export const washerProductUpdateDTO = washerProductDTO.partial().omit({ 
    userId: true, 
    productId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TWasherProductUpdateDTO = z.infer<typeof washerProductUpdateDTO>; 