import { z } from 'zod';
import { TICKET_STATUS } from './ticket.schema';

export const ticketDTO = z.object({
    id: z.string().optional(),
    userId: z.string(),
    assignedTo: z.string().optional(),
    assignedAt: z.date().optional(),
    object: z.string().max(255).optional(),
    objectId: z.string().optional(),
    title: z.string().max(255),
    description: z.string(),
    status: z.enum(TICKET_STATUS).default('OPEN'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TTicketDTO = z.infer<typeof ticketDTO>;
