import { TProperty } from "./property.schema";

export type TPropertyEvents = {
    'property.created': TProperty;
    'property.updated': {
        prev: TProperty;
        next: TProperty;
    };
    'property.deleted': {
        id: string;
    };
};
