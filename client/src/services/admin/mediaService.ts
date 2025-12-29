/**
 * Media Service
 * Handles media/file upload API calls
 */

import adminApi from '../adminApi';
import type { Media, ApiResponse } from '../../types/admin';

export const mediaService = {
    /**
     * Get all media files
     */
    async getAll(category?: string): Promise<ApiResponse<Media[]>> {
        const params = category ? { category } : {};
        const response = await adminApi.get<ApiResponse<Media[]>>('/media', { params });
        return response.data;
    },

    /**
     * Upload file
     */
    async upload(file: File, altText?: string, category?: string): Promise<ApiResponse<Media>> {
        const formData = new FormData();
        formData.append('file', file);
        if (altText) formData.append('alt_text', altText);
        if (category) formData.append('category', category);

        const response = await adminApi.post<ApiResponse<Media>>('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Delete media file
     */
    async delete(id: string): Promise<ApiResponse> {
        const response = await adminApi.delete<ApiResponse>(`/media/${id}`);
        return response.data;
    },
};
