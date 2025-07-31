import { TWasherProduct } from "./washer-product.schema";

export type TWasherProductEvents = {
    'washer-product.created': TWasherProduct;
    'washer-product.updated': {
        prev: TWasherProduct;
        next: TWasherProduct;
    };
    'washer-product.deleted': {
        id: string;
        userId: string;
    };
}; 