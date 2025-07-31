import { TProduct } from "./product.schema";

export type TProductEvents = {
    'product.created': TProduct;
    'product.updated': {
        prev: TProduct;
        next: TProduct;
    };
    'product.deleted': {
        id: string;
    };
};
