/**
 * Product Validation Schema
 * Zod schema for product form validation
 */

import { z } from 'zod';

export const productSchema = z.object({
    category_id: z.string().min(1, 'Category is required'),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    short_description: z.string().optional(),
    full_description: z.string().optional(),
    features: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    specifications: z.array(z.string()).optional(),
    image_url: z.string().optional(),
    gallery_images: z.array(z.string()).optional(),
    order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
    meta_title: z.string().max(200, 'Meta title must be less than 200 characters').optional(),
    meta_description: z.string().max(500, 'Meta description must be less than 500 characters').optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
