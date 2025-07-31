import { TPropertyHour } from "./property-hour.schema";

export type TPropertyHourEvents = {
    'property-hour.created': TPropertyHour;
    'property-hour.updated': {
        prev: TPropertyHour;
        next: TPropertyHour;
    };
    'property-hour.deleted': {
        id: string;
        propertyId: string;
    };
};
