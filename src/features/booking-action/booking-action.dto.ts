import { z } from "zod";

export const bookingActionDTO = z.object({
    id: z.string(),
    bookingId: z.string(),
    
    message: z.string().max(255),
    metadata: z.string().optional(),
    
    createdBy: z.string(),
    createdAt: z.date().optional(),
});

export type TBookingActionDTO = z.infer<typeof bookingActionDTO>;
