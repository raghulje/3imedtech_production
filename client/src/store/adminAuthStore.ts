/**
 * Admin Authentication Store
 * Zustand store for managing admin auth state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/admin';

interface AdminAuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) => {
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            updateUser: (userData) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                }));
            },
        }),
        {
            name: '3i-admin-auth',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
