/**
 * Category Service
 * Handles category API calls
 */

import adminApi from '../adminApi';
import type { ProductCategory, ApiResponse } from '../../types/admin';

export const categoryService = {
    /**
     * Get all categories
     */
    async getAll(): Promise<ApiResponse<ProductCategory[]>> {
        const response = await adminApi.get<ApiResponse<ProductCategory[]>>('/categories');
        return response.data;
    },

    /**
     * Get category by slug
     */
    async getBySlug(slug: string): Promise<ApiResponse<ProductCategory>> {
        const response = await adminApi.get<ApiResponse<ProductCategory>>(`/categories/${slug}`);
        return response.data;
    },

    /**
     * Create category
     */
    async create(data: Partial<ProductCategory>): Promise<ApiResponse<ProductCategory>> {
        const response = await adminApi.post<ApiResponse<ProductCategory>>('/categories', data);
        return response.data;
    },

    /**
     * Update category
     */
    async update(id: string, data: Partial<ProductCategory>): Promise<ApiResponse<ProductCategory>> {
        const response = await adminApi.put<ApiResponse<ProductCategory>>(`/categories/${id}`, data);
        return response.data;
    },

    /**
     * Delete category
     */
    async delete(id: string): Promise<ApiResponse> {
        const response = await adminApi.delete<ApiResponse>(`/categories/${id}`);
        return response.data;
    },
};
