import { TWasherSlot } from './washer-slot.schema';

export type TWasherSlotEvents = {
    'washer-slot.created': TWasherSlot;
    'washer-slot.updated': { prev: TWasherSlot; next: TWasherSlot };
    'washer-slot.deleted': { id: string; userId: string;};
}
