import { z } from 'zod';
import { ticketDTO } from './ticket.dto';

export const ticketCreateDTO = ticketDTO.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export type TTicketCreateDTO = z.infer<typeof ticketCreateDTO>;

export const ticketFindQueryDTO = ticketDTO.pick({
    userId: true,
    assignedTo: true,
    status: true,
    object: true,
    objectId: true,
}).partial();
export type TTicketFindQueryDTO = z.infer<typeof ticketFindQueryDTO>;

export const ticketUpdateDTO = ticketDTO.partial().extend({
    userId: z.string().optional(),
});
export type TTicketUpdateDTO = z.infer<typeof ticketUpdateDTO>;
