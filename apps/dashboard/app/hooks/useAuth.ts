'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AuthUser, AuthContext } from '../lib/types';
import { dashboardApi } from '../lib/api/dashboardApi';

// Storage keys
const AUTH_TOKEN_KEY = 'app_auth_token';
const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Parse JWT token without external library.
 * Returns null if parsing fails.
 */
function parseJwt(token: string): { email?: string } | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('JWT Parse Error:', e);
        return null;
    }
}

/**
 * Set auth cookie for middleware authentication
 */
function setAuthCookie(token: string): void {
    document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=2592000; SameSite=Lax`;
}

/**
 * Clear auth cookie
 */
function clearAuthCookie(): void {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * useAuth hook - black box authentication module.
 * 
 * Handles all authentication concerns:
 * - URL token extraction (OAuth callback)
 * - localStorage persistence
 * - Cookie synchronization for middleware
 * - NextAuth fallback
 * 
 * Interface: { user, token, isLoading, login, logout }
 */
export function useAuth(): AuthContext {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from storage or URL
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const urlToken = searchParams.get('user');
        const localToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const isSuccess = searchParams.get('success') === 'true';

        let tokenToUse: string | null = null;

        // Scenario A: New login from OAuth callback
        if (isSuccess && urlToken) {
            localStorage.setItem(AUTH_TOKEN_KEY, urlToken);
            setAuthCookie(urlToken);
            tokenToUse = urlToken;
            // Clean URL after extracting token
            router.replace('/');
        }
        // Scenario B: Existing token in localStorage
        else if (localToken) {
            tokenToUse = localToken;
        }

        if (tokenToUse) {
            const decoded = parseJwt(tokenToUse);
            if (decoded?.email) {
                setToken(tokenToUse);
                setUser({ email: decoded.email });
            } else {
                // Invalid token - clean up
                localStorage.removeItem(AUTH_TOKEN_KEY);
                clearAuthCookie();
            }
        }
        // Scenario C: NextAuth session fallback
        else if (session?.user?.email) {
            setUser({ email: session.user.email });
        }

        setIsLoading(false);
    }, [searchParams, session, router]);

    const login = useCallback(() => {
        window.location.href = dashboardApi.getLoginUrl();
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        clearAuthCookie();
        setToken(null);
        setUser(null);
        router.push('/');
    }, [router]);

    return {
        user,
        token,
        isLoading,
        login,
        logout
    };
}
