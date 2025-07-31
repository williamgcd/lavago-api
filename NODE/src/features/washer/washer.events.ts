import { TWasher } from "./washer.schema";

export type TWasherEvents = {
    'washer.created': TWasher;
    'washer.updated': {
        prev: TWasher;
        next: TWasher;
    };
    'washer.deleted': {
        id: string;
        userId: string;
    };
};
