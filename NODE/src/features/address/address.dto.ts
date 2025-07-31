import { z } from 'zod';

export const addressDTO = z.object({
    id: z.string().optional(),
    userId: z.string(),

    label: z.string().max(255),
    
    street: z.string().max(255),
    number: z.string().max(255),
    complement: z.string().max(255).optional(),
    neighborhood: z.string().max(255),
    city: z.string().max(255),
    state: z.string().max(255),
    country: z.string().max(255).default('BR'),
    zip: z.string().max(255),

    notes: z.string().max(255).optional(),
    
    lat: z.number().optional(),
    lng: z.number().optional(),
    
    isDefault: z.boolean().default(false),
    
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type TAddressDTO = z.infer<typeof addressDTO>;
