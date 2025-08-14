import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TTransactionDto = z.infer<typeof d.TransactionDto>;

// Default CRUD DTOs
export type TTransactionDtoCreate = z.infer<typeof d.TransactionDtoCreate>;
export type TTransactionDtoDelete = z.infer<typeof d.TransactionDtoDelete>;
export type TTransactionDtoFilter = z.infer<typeof d.TransactionDtoFilter>;
export type TTransactionDtoUpdate = z.infer<typeof d.TransactionDtoUpdate>;

// Controller DTOs
export type TTransactionDtoById = z.infer<typeof d.TransactionDtoById>;
export type TTransactionDtoByUserId = z.infer<typeof d.TransactionDtoByUserId>;

// Public DTOs
export type TTransactionDtoPublic = z.infer<typeof d.TransactionDtoPublic>;
