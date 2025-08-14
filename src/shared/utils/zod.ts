import z from 'zod';

export const zInterval = z.object({
    ini: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/),
});

export const zKeyInterval = z.record(z.string(), zInterval);

export const zNull = <T extends z.ZodTypeAny>(schema: T) =>
    schema.nullable().optional() as z.ZodOptional<z.ZodNullable<T>>;
