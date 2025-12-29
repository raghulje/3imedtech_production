/**
 * Product Service
 * Handles product API calls
 */

import adminApi from '../adminApi';
import type { Product, ProductFormData, ApiResponse } from '../../types/admin';

export const productService = {
    /**
     * Get all products
     */
    async getAll(categoryId?: string): Promise<ApiResponse<Product[]>> {
        const params = categoryId ? { category_id: categoryId } : {};
        const response = await adminApi.get<ApiResponse<Product[]>>('/products', { params });
        return response.data;
    },

    /**
     * Get product by slug
     */
    async getBySlug(slug: string): Promise<ApiResponse<Product>> {
        const response = await adminApi.get<ApiResponse<Product>>(`/products/${slug}`);
        return response.data;
    },

    /**
     * Create product
     */
    async create(data: ProductFormData): Promise<ApiResponse<Product>> {
        const response = await adminApi.post<ApiResponse<Product>>('/products', data);
        return response.data;
    },

    /**
     * Update product
     */
    async update(id: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
        const response = await adminApi.put<ApiResponse<Product>>(`/products/${id}`, data);
        return response.data;
    },

    /**
     * Delete product
     */
    async delete(id: string): Promise<ApiResponse> {
        const response = await adminApi.delete<ApiResponse>(`/products/${id}`);
        return response.data;
    },
};
