import axios from 'axios';
import { SmartItem, DashboardStats, SyncStatus } from '../types';

/**
 * Intelligent API URL detection.
 * 
 * Priority:
 * 1. NEXT_PUBLIC_API_URL environment variable (if explicitly set)
 * 2. Runtime domain detection:
 *    - okanacer.xyz → https://api.okanacer.xyz/api
 *    - localhost → http://localhost:8080/api
 * 
 * This prevents accidentally using localhost in production.
 */
function getApiUrl(): string {
    // If explicitly set via environment variable, use it
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // Runtime detection based on current domain
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // Production domain
        if (hostname === 'okanacer.xyz' || hostname.endsWith('.okanacer.xyz')) {
            return 'https://api.okanacer.xyz/api';
        }

        // Development (localhost or 127.0.0.1)
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8080/api';
        }
    }

    // SSR fallback (server-side rendering, before window is available)
    // Default to production API for safety
    return 'https://api.okanacer.xyz/api';
}

const API_URL = getApiUrl();

// Debug logging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.log('[Dashboard API] Environment detected:', {
        hostname: window.location.hostname,
        apiUrl: API_URL,
        fromEnv: !!process.env.NEXT_PUBLIC_API_URL
    });
}

/**
 * Dashboard API client - black box abstraction over HTTP calls.
 * Automatically detects environment and uses correct API URL.
 * 
 * Note: API_URL already includes /api prefix, so paths are relative to that.
 */
export const dashboardApi = {
    /**
     * Fetch aggregated statistics for a user
     */
    async getStats(userId: string, token?: string): Promise<DashboardStats> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get<DashboardStats>(
            `${API_URL}/dashboard/stats?userId=${userId}`,
            { headers }
        );
        return response.data;
    },

    /**
     * Fetch all smart items for a user
     */
    async getItems(userId: string, token?: string): Promise<SmartItem[]> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get<SmartItem[]>(
            `${API_URL}/dashboard/items?userId=${userId}`,
            { headers }
        );
        return response.data || [];
    },

    /**
     * Get current sync status for a user
     */
    async getSyncStatus(userId: string, token?: string): Promise<SyncStatus> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get<SyncStatus>(
            `${API_URL}/sync/status?userId=${userId}`,
            { headers }
        );
        return response.data;
    },

    /**
     * Start email synchronization for a user.
     * Called when user clicks "Synchronize Email" button.
     */
    async startSync(userId: string, token?: string): Promise<void> {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axios.post(
            `${API_URL}/sync/start?userId=${userId}`,
            {},
            { headers }
        );
    },

    /**
     * Get the Google OAuth login URL with current origin for proper redirect
     */
    getLoginUrl(redirectUrl?: string): string {
        const url = redirectUrl || (typeof window !== 'undefined' ? window.location.origin : '');
        return `${API_URL}/auth/login/google${url ? `?redirectUrl=${encodeURIComponent(url)}` : ''}`;
    }
};
