import { and, count, eq, isNull, like } from "drizzle-orm";
import { PAGINATION } from "@/constants";
import { throwRecordNotFound } from "@/errors";
import { db } from "@/database";

import { TTicket, tickets } from "./ticket.schema";
import { TTicketFindQueryDTO } from "./ticket.controller.dto";

export const ticketRepository = {
    create: async (data: Omit<Partial<TTicket>, 'id'>): Promise<TTicket> => {
        const ticket = {...data } as TTicket;

        try {
            const result = await db.insert(tickets).values(ticket).returning();
            if (result.length === 0) {
                throw new Error('Ticket not created');
            }
            return result[0] as TTicket;
        } catch (err) {
            console.error('ticketRepository.create', err);
            throw err;
        }
    },

    deleteById: async (id: string): Promise<void> => {
        try {
            await ticketRepository.getById(id);
            await db.delete(tickets).where(eq(tickets.id, id));
        } catch (err) {
            console.error('ticketRepository.deleteById', err);
            throw err;
        }
    },

    find: async (
        limit: number = PAGINATION.DEFAULT_LIMIT,
        page: number = 1,
        query?: TTicketFindQueryDTO,
    ): Promise<{ data: TTicket[], total: number }> => {
        try {
            const offset = (page - 1) * limit;

            const where = [
                isNull(tickets.deletedAt)
            ];

            if (query?.userId) {
                where.push(eq(tickets.userId, query.userId));
            }
            if (query?.assignedTo) {
                where.push(eq(tickets.assignedTo, query.assignedTo));
            }
            if (query?.status) {
                where.push(eq(tickets.status, query.status));
            }
            if (query?.object) {
                where.push(like(tickets.object, `${query.object}%`));
            }
            if (query?.object && query?.objectId) {
                where.push(eq(tickets.objectId, query.objectId));
            }

            const totalResult = await db
                .select({ total: count() })
                .from(tickets)
                .where(and(...where));
            const total = totalResult[0]?.total;

            const result = await db
                .select()
                .from(tickets)
                .where(and(...where))
                .limit(limit)
                .offset(offset);
            return {
                data: result as TTicket[],
                total: Number(total)
            };
        } catch (err) {
            console.error('ticketRepository.find', err);
            throw err;
        }
    },

    getById: async (id: string): Promise<TTicket> => {
        try {
            const result = await db
                .select()
                .from(tickets)
                .where(and(
                    eq(tickets.id, id),
                    isNull(tickets.deletedAt)
                ))
                .limit(1);
            if (!result.length) {
                throwRecordNotFound('Ticket not found');
            }
            return result[0] as TTicket;
        } catch (err) {
            console.error('ticketRepository.getById', err);
            throw err;
        }
    },

    updateById: async (id: string, ticket: Partial<TTicket>): Promise<TTicket> => {
        try {
            const updateData: Partial<TTicket> = Object.fromEntries(
                Object.entries(ticket).filter(([_, value]) => value !== undefined)
            );
            if (Object.keys(updateData).length === 0) {
                return ticketRepository.getById(id);
            }

            const result = await db.update(tickets)
                .set(updateData)
                .where(eq(tickets.id, id))
                .returning();
            if (result.length === 0) {
                throwRecordNotFound('Ticket not found');
            }
            return result[0] as TTicket;
        } catch (err) {
            console.error('ticketRepository.updateById', err);
            throw err;
        }
    }
};
