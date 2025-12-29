/**
 * Admin API Client
 * Axios instance configured for 3iserver backend
 */

import axios from 'axios';
import { useAdminAuthStore } from '../store/adminAuthStore';

const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api';

// Create axios instance
const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
adminApi.interceptors.request.use(
    (config) => {
        const token = useAdminAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            useAdminAuthStore.getState().logout();
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default adminApi;
