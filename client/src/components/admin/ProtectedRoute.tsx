import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '../../store/adminAuthStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, logout } = useAdminAuthStore();
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            console.log('🔒 ProtectedRoute: Validating authentication...', {
                hasToken: !!token,
                hasUser: !!user,
                isAuthenticated
            });

            // If no token or user, redirect immediately
            if (!token || !user || !isAuthenticated) {
                console.log('❌ ProtectedRoute: Missing auth data, redirecting to login');
                logout();
                setIsValidating(false);
                setIsValid(false);
                return;
            }

            // Validate token with server
            try {
                console.log('🔍 ProtectedRoute: Validating token with server...');
                // Use relative URL since Vite proxy handles /api routes
                const response = await fetch('/api/auth/verify', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('📡 ProtectedRoute: Verify response status:', response.status);

                if (!response.ok) {
                    // Token is invalid, logout and redirect
                    console.log('❌ ProtectedRoute: Token validation failed, redirecting to login');
                    logout();
                    setIsValidating(false);
                    setIsValid(false);
                    return;
                }

                // Token is valid
                console.log('✅ ProtectedRoute: Token is valid, allowing access');
                setIsValidating(false);
                setIsValid(true);
            } catch (error) {
                console.error('❌ ProtectedRoute: Token validation error:', error);
                // On error, logout and redirect
                logout();
                setIsValidating(false);
                setIsValid(false);
            }
        };

        validateToken();
    }, [token, user, isAuthenticated, logout]);

    // Show loading state while validating
    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated or token invalid, redirect to login
    if (!isValid || !isAuthenticated || !token || !user) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}
