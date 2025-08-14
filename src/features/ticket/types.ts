import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TTicketDto = z.infer<typeof d.TicketDto>;

// Default CRUD DTOs
export type TTicketDtoCreate = z.infer<typeof d.TicketDtoCreate>;
export type TTicketDtoDelete = z.infer<typeof d.TicketDtoDelete>;
export type TTicketDtoFilter = z.infer<typeof d.TicketDtoFilter>;
export type TTicketDtoUpdate = z.infer<typeof d.TicketDtoUpdate>;

// Controller DTOs
export type TTicketDtoById = z.infer<typeof d.TicketDtoById>;
export type TTicketDtoByAssignedTo = z.infer<typeof d.TicketDtoByAssignedTo>;
export type TTicketDtoByEntity = z.infer<typeof d.TicketDtoByEntity>;
export type TTicketDtoByEntityId = z.infer<typeof d.TicketDtoByEntityId>;
export type TTicketDtoByUserId = z.infer<typeof d.TicketDtoByUserId>;

// Public DTOs
export type TTicketDtoPublic = z.infer<typeof d.TicketDtoPublic>;
