import axios from 'axios';
import { SmartItem, DashboardStats, SyncStatus } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Dashboard API client - black box abstraction over HTTP calls.
 * Implementation details (axios, base URL, headers) are hidden.
 * 
 * To replace: implement the same interface with different HTTP client.
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
     * Get the Google OAuth login URL
     */
    getLoginUrl(): string {
        return `${API_URL}/api/auth/login/google`;
    }
};
