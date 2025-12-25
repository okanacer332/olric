import axios from 'axios';
import { SmartItem, DashboardStats, SyncStatus } from '../types';

// API_URL already includes /api suffix from .env.local (http://localhost:8080/api)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Dashboard API client - black box abstraction over HTTP calls.
 * Implementation details (axios, base URL, headers) are hidden.
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
     * Get the Google OAuth login URL
     */
    getLoginUrl(): string {
        return `${API_URL}/auth/login/google`;
    }
};
