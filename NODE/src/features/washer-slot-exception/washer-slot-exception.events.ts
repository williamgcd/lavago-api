import { TWasherSlotException } from "./washer-slot-exception.schema";

export type TWasherSlotExceptionEvents = {
    'washer-slot-exception.created': TWasherSlotException;
    'washer-slot-exception.updated': {
        prev: TWasherSlotException;
        next: TWasherSlotException;
    };
    'washer-slot-exception.deleted': {
        id: string;
        userId: string;
    };
};
