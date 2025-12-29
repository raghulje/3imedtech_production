import api from './api';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },
};

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },
};

export const pageService = {
    getAll: async (params?: any) => {
        const response = await api.get('/pages', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/pages/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/pages', data);
        return response.data;
    },

    update: async (id: number, data: any) => {
        const response = await api.put(`/pages/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/pages/${id}`);
        return response.data;
    },

    toggleStatus: async (id: number, status: string) => {
        const response = await api.patch(`/pages/${id}/publish`, { status });
        return response.data;
    },
};

export const productService = {
    getAll: async (params?: any) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/products', data);
        return response.data;
    },

    update: async (id: number, data: any) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
};

export const categoryService = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getTree: async () => {
        const response = await api.get('/categories/tree');
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    update: async (id: number, data: any) => {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};

export const mediaService = {
    getAll: async (params?: any) => {
        const response = await api.get('/media', { params });
        return response.data;
    },

    upload: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/media/${id}`);
        return response.data;
    },
};

export const activityService = {
    getAll: async (params?: any) => {
        const response = await api.get('/activity-logs', { params });
        return response.data;
    },

    getRecent: async (limit = 20) => {
        const response = await api.get('/activity-logs/recent', { params: { limit } });
        return response.data;
    },
};

export const settingsService = {
    getAll: async () => {
        const response = await api.get('/settings');
        return response.data;
    },

    update: async (key: string, value: string) => {
        const response = await api.put(`/settings/${key}`, { setting_value: value });
        return response.data;
    },
};

export const userService = {
    getAll: async (params?: any) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/users', data);
        return response.data;
    },

    update: async (id: number, data: any) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    getRoles: async () => {
        const response = await api.get('/users/roles');
        return response.data;
    },
};

export const contentService = {
    getPage: async (slug: string) => {
        const response = await api.get(`/public/pages/${slug}`);
        return response.data;
    },

    getNavigation: async (location: string) => {
        const response = await api.get(`/public/navigation/${location}`);
        return response.data;
    },

    getSettings: async () => {
        const response = await api.get('/public/settings');
        return response.data;
    }
};
