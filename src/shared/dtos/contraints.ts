import z from 'zod';

export const ConstraintsDto = z
    .object({
        hasWaterAccess: z.boolean().optional(),
        hasWashingSpace: z.boolean().optional(),
    })
    .optional()
    .default({});
