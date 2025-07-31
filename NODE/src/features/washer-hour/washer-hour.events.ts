import { TWasherHour } from "./washer-hour.schema";

export type TWasherHourEvents = {
    'washer-hour.created': TWasherHour;
    'washer-hour.updated': {
        prev: TWasherHour;
        next: TWasherHour;
    };
    'washer-hour.deleted': {
        id: string;
        userId: string;
    };
};
