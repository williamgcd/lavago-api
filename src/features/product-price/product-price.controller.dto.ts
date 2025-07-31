import { z } from "zod";
import { productPriceDTO } from "./product-price.dto";
import { VEHICLE_TYPES } from "../vehicle";

export const productPriceCreateDTO = productPriceDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TProductPriceCreateDTO = z.infer<typeof productPriceCreateDTO>;

export const productPriceFindQueryDTO = productPriceDTO.pick({
    productId: true,
    vehicleType: true,
    price: true,
    washerQuota: true,
    traineeQuota: true,
    duration: true,
}).partial();
export type TProductPriceFindQueryDTO = z.infer<typeof productPriceFindQueryDTO>;

export const productPriceGetByProductIdAndVehicleTypeDTO = z.object({
    productId: z.string(),
    vehicleType: z.enum(VEHICLE_TYPES),
});
export type TProductPriceGetByProductIdAndVehicleTypeDTO = z.infer<typeof productPriceGetByProductIdAndVehicleTypeDTO>;

export const productPriceUpdateDTO = productPriceDTO.partial().omit({ 
    productId: true,
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
export type TProductPriceUpdateDTO = z.infer<typeof productPriceUpdateDTO>;
