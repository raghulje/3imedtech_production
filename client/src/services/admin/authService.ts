/**
 * Admin Auth Service
 * Handles authentication API calls
 */

import adminApi from '../adminApi';
import type { LoginCredentials, AuthResponse, User, ApiResponse } from '../../types/admin';

export const authService = {
    /**
     * Login admin user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await adminApi.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<ApiResponse<User>> {
        const response = await adminApi.get<ApiResponse<User>>('/auth/profile');
        return response.data;
    },

    /**
     * Logout
     */
    async logout(): Promise<ApiResponse> {
        const response = await adminApi.post<ApiResponse>('/auth/logout');
        return response.data;
    },
};
