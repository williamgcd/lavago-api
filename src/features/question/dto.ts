import z from 'zod';

import { zNull } from '@/shared/utils/zod';
import { RATING_ENUMS } from '../rating/enums';

export const QuestionDto = z.object({
    id: z.uuid(),
    created_at: z.coerce.date(),
    deleted_at: zNull(z.coerce.date()),
    updated_at: zNull(z.coerce.date()),

    entity: zNull(z.string().min(1).max(255)),

    label: z.string().min(1).max(255),
    descr: zNull(z.string().min(1).max(255)),

    metric: z.string().default('overall'),
    pattern: z.enum(RATING_ENUMS.PATTERN).default('rating'),
    scale: z.enum(RATING_ENUMS.SCALE).default('1-5'),

    questions: z.record(z.string(), z.any()).default({}),
});

/* ************************** */
/* Default CRUD DTOs
/* ************************** */

export const QuestionDtoCreate = QuestionDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
});

export const QuestionDtoDelete = QuestionDto.pick({
    id: true,
});

export const QuestionDtoFilter = QuestionDto.pick({
    entity: true,
    metric: true,
    pattern: true,
}).partial();

export const QuestionDtoUpdate = QuestionDto.omit({
    id: true,
    created_at: true,
    deleted_at: true,
    updated_at: true,
}).partial();

/* ************************** */
/* Controller DTOs
/* ************************** */

export const QuestionDtoById = z.object({
    question_id: QuestionDto.shape.id,
});

export const QuestionDtoByEntity = z.object({
    entity: QuestionDto.shape.entity,
});

/* ************************** */
/* Public DTOs
/* ************************** */

export const QuestionDtoPublic = QuestionDto;
