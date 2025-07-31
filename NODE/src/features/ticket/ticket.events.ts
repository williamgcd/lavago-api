import { TTicket } from './ticket.schema';

export type TTicketEvents = {
    'ticket.created': TTicket;
    'ticket.updated': { prev: TTicket; next: TTicket };
    'ticket.deleted': { id: string; userId: string;};

    'ticket.updated.assignedTo': { id: string; assignedTo: string };
}
