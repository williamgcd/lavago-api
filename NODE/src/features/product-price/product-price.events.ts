import { TProductPrice } from "./product-price.schema";

export type TProductPriceEvents = {
    'product-price.created': TProductPrice;
    'product-price.updated': {
        prev: TProductPrice;
        next: TProductPrice;
    };
    'product-price.deleted': {
        id: string;
        productId: string;
    };
};
