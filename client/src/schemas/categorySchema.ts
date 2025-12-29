/**
 * Category Validation Schema
 * Zod schema for category form validation
 */

import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    icon_url: z.string().optional(),
    order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
