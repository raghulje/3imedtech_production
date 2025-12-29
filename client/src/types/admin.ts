/**
 * TypeScript Interfaces for Admin Panel
 * Defines types for all admin entities
 */

// User & Auth
export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'editor';
    user_type?: 'Admin' | 'Regular User'; // Original user_type from backend
    allowed_cms_pages?: string | string[] | null; // CMS page permissions (JSON string or array)
    is_active: boolean;
    last_login?: string;
    created_at?: string;
    updated_at?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

// Product Category
export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon_url?: string;
    order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    products?: Product[];
}

// Product
export interface Product {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    short_description?: string;
    full_description?: string;
    features?: string[];
    benefits?: string[];
    specifications?: Record<string, any>;
    image_url?: string;
    gallery_images?: string[];
    order: number;
    is_active: boolean;
    meta_title?: string;
    meta_description?: string;
    created_at?: string;
    updated_at?: string;
    category?: ProductCategory;
}

export interface ProductFormData {
    category_id: string;
    name: string;
    short_description?: string;
    full_description?: string;
    features?: string[];
    benefits?: string[];
    specifications?: Record<string, any>;
    image_url?: string;
    gallery_images?: string[];
    order?: number;
    is_active?: boolean;
    meta_title?: string;
    meta_description?: string;
}

// Page
export interface Page {
    id: string;
    slug: string;
    title: string;
    content?: Record<string, any>;
    meta_title?: string;
    meta_description?: string;
    is_published: boolean;
    published_at?: string;
    created_at?: string;
    updated_at?: string;
}

// Media
export interface Media {
    id: string;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    url: string;
    alt_text?: string;
    category: 'product_image' | 'banner' | 'icon' | 'document' | 'other';
    uploaded_by?: string;
    created_at?: string;
    updated_at?: string;
}

// Settings
export interface Settings {
    id: string;
    key: string;
    value: any;
    description?: string;
    is_public: boolean;
    created_at?: string;
    updated_at?: string;
}

// API Response
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    timestamp?: string;
}

// Dashboard Stats
export interface DashboardStats {
    products: {
        total: number;
        active: number;
    };
    categories: {
        total: number;
        active: number;
    };
    media: {
        total: number;
    };
    pages: {
        total: number;
        published: number;
    };
}
