import z from 'zod';

import * as d from './dto';

// Entity type (matches database)
export type TQuestionDto = z.infer<typeof d.QuestionDto>;

// Default CRUD DTOs
export type TQuestionDtoCreate = z.infer<typeof d.QuestionDtoCreate>;
export type TQuestionDtoDelete = z.infer<typeof d.QuestionDtoDelete>;
export type TQuestionDtoFilter = z.infer<typeof d.QuestionDtoFilter>;
export type TQuestionDtoUpdate = z.infer<typeof d.QuestionDtoUpdate>;

// Controller DTOs
export type TQuestionDtoById = z.infer<typeof d.QuestionDtoById>;
export type TQuestionDtoByEntity = z.infer<typeof d.QuestionDtoByEntity>;

// Public DTOs
export type TQuestionDtoPublic = z.infer<typeof d.QuestionDtoPublic>;
